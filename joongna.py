from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By

import re
import time
import urllib.parse


CARD_SELECTOR = "a[href*='/product/']"
BUY_KEYWORDS = ("구함", "구합니다", "구해요", "삽니다")
MAX_PRICE = 50_000_000
TOTAL_PATTERN = re.compile(r"총\s*([\d,]+)\s*개")


def search(keyword):
    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install())
    )

    results = []
    seen = set()

    def search_url(page):
        path = urllib.parse.quote(keyword)
        base = f"https://web.joongna.com/search/{path}"
        if page <= 1:
            return base
        return f"{base}?page={page}"

    def parse_total():
        match = TOTAL_PATTERN.search(driver.page_source)
        if not match:
            return None
        return int(match.group(1).replace(",", ""))

    def parse_listing(card):
        href = card.get_attribute("href")
        if not href or href in seen:
            return None

        text = card.text.strip()
        if not text or "판매완료" in text:
            return None
        if any(k in text for k in BUY_KEYWORDS):
            return None

        spans = card.find_elements(By.TAG_NAME, "span")
        title = None
        price = None

        for i, span in enumerate(spans):
            t = span.text.strip()
            if t.replace(",", "").isdigit():
                price = int(t.replace(",", ""))
                if price <= 0 or price > MAX_PRICE:
                    return None
                if i > 0:
                    title = spans[i - 1].text.strip()
                break

        if not title or price is None:
            return None

        return title, price, href

    def collect_page():
        for card in driver.find_elements(By.CSS_SELECTOR, CARD_SELECTOR):
            try:
                parsed = parse_listing(card)
                if not parsed:
                    continue
                title, price, href = parsed
                seen.add(href)
                results.append({
                    "title": title,
                    "url": href,
                    "price": price,
                })
            except Exception:
                continue

    try:
        last_page = None
        page = 1

        driver.get(search_url(1))
        time.sleep(5)

        while page <= 500:
            if page > 1:
                driver.get(search_url(page))
                time.sleep(4)

            cards = driver.find_elements(By.CSS_SELECTOR, CARD_SELECTOR)
            if not cards:
                break

            if last_page is None and page == 1:
                total = parse_total()
                if total is not None:
                    last_page = max((total + len(cards) - 1) // len(cards), 1)

            collect_page()

            if last_page is not None and page >= last_page:
                print(f"페이지네이션 마지막(페이지 {page})까지 수집했습니다.")
                break

            page += 1
    finally:
        driver.quit()

    return results


def print_summary(keyword, results):
    total_count = len(results)
    print(f"\n검색어: {keyword}")
    print(f"총 {total_count}개 발견")

    if total_count == 0:
        print("가격 정보를 찾지 못했습니다.")
        return

    avg = sum(r["price"] for r in results) / total_count
    print(f"평균 가격: {int(avg):,}원")


if __name__ == "__main__":
    keyword = input("검색어를 입력하세요: ")
    results = search(keyword)
    print_summary(keyword, results)
