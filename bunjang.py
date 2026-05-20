from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

from selenium.webdriver.common.by import By

import urllib.parse
import time
import re


CARD_SELECTOR = "a[href*='/products/']"
MORE_BUTTON_SELECTORS = [
    (
        By.XPATH,
        '//button[.//span[normalize-space()="더보기"]]',
    ),
    (
        By.CSS_SELECTOR,
        "button._full_1cw4e_108",
    ),
]
PRICE_PATTERN = re.compile(r"(\d{1,3}(?:,\d{3})*)\s*원")
MAX_PRICE = 50_000_000
BUY_KEYWORDS = ("구함", "구합니다", "삽니다")


def parse_price_text(text):
    price_match = PRICE_PATTERN.search(text)

    if not price_match:
        return None

    price = int(price_match.group(1).replace(",", ""))

    if price <= 0 or price > MAX_PRICE:
        return None

    return price


def extract_price(card, lines):
    paragraphs = card.find_elements(By.TAG_NAME, "p")

    if paragraphs:
        price = parse_price_text(paragraphs[0].text)

        if price is not None:
            return price

    if lines:
        return parse_price_text(lines[0])

    return None


def extract_title(card, lines):
    paragraphs = card.find_elements(By.TAG_NAME, "p")

    if len(paragraphs) >= 2:
        title = paragraphs[1].text.strip()

        if title and "판매완료" not in title:
            return title

    for line in lines:
        if PRICE_PATTERN.search(line):
            continue

        if "판매완료" in line:
            continue

        return line

    return None


def parse_card(card):
    text = card.text.strip()

    if not text or "판매완료" in text:
        return None

    if any(keyword in text for keyword in BUY_KEYWORDS):
        return None

    lines = [
        line.strip()
        for line in text.split("\n")
        if line.strip()
    ]

    if len(lines) < 2:
        return None

    price = extract_price(card, lines)
    title = extract_title(card, lines)

    if price is None or not title:
        return None

    return title, price


def search(keyword):
    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install())
    )

    url = (
        "https://m.bunjang.co.kr/keywords/"
        f"{urllib.parse.quote(keyword)}"
    )

    driver.get(url)
    time.sleep(5)

    results = []
    seen = set()

    def collect_visible_cards():
        for card in driver.find_elements(By.CSS_SELECTOR, CARD_SELECTOR):
            try:
                href = card.get_attribute("href")

                if not href or href in seen:
                    continue

                driver.execute_script(
                    "arguments[0].scrollIntoView({block:'center'});",
                    card
                )
                time.sleep(0.08)

                parsed = parse_card(card)

                if not parsed:
                    continue

                title, price = parsed

                seen.add(href)
                results.append({
                    "title": title,
                    "price": price,
                    "url": href
                })

            except:
                continue

    def scroll_gently(amount=500):
        driver.execute_script(
            f"window.scrollBy(0, {amount});"
        )

    def find_more_button():
        for by, selector in MORE_BUTTON_SELECTORS:
            buttons = driver.find_elements(by, selector)

            if buttons:
                return buttons[0]

        return None

    def is_more_button_in_viewport(button):
        return driver.execute_script(
            "const rect = arguments[0].getBoundingClientRect();"
            "return rect.height > 0 && rect.width > 0"
            " && rect.top < window.innerHeight"
            " && rect.bottom > 0;",
            button,
        )

    def click_more_button():
        last_y = driver.execute_script("return window.scrollY;")
        same_scroll = 0

        for _ in range(120):
            more_btn = find_more_button()

            if more_btn:
                driver.execute_script(
                    "arguments[0].scrollIntoView({block:'center'});",
                    more_btn
                )
                time.sleep(1)

                if not is_more_button_in_viewport(more_btn):
                    scroll_gently()
                    time.sleep(0.8)
                    continue

                before_height = driver.execute_script(
                    "return document.body.scrollHeight;"
                )
                before_links = len(
                    driver.find_elements(By.CSS_SELECTOR, CARD_SELECTOR)
                )

                driver.execute_script("arguments[0].click();", more_btn)
                time.sleep(4)

                after_height = driver.execute_script(
                    "return document.body.scrollHeight;"
                )
                after_links = len(
                    driver.find_elements(By.CSS_SELECTOR, CARD_SELECTOR)
                )

                if (
                    after_height > before_height
                    or after_links > before_links
                    or not find_more_button()
                ):
                    print("더보기 클릭")
                    return True

            scroll_gently()
            time.sleep(0.8)

            current_y = driver.execute_script("return window.scrollY;")

            if current_y == last_y:
                same_scroll += 1
                if same_scroll >= 3:
                    break
            else:
                same_scroll = 0

            last_y = current_y

        return False

    def collect_after_more():
        last_count = 0
        stagnant_rounds = 0

        while stagnant_rounds < 3:
            collect_visible_cards()

            cards = driver.find_elements(By.CSS_SELECTOR, CARD_SELECTOR)

            if cards:
                driver.execute_script(
                    "arguments[0].scrollIntoView({block:'end'});",
                    cards[-1]
                )

            scroll_gently()
            time.sleep(0.6)

            current_count = len(results)

            print("현재 수집 개수:", current_count)

            if current_count == last_count:
                stagnant_rounds += 1
            else:
                stagnant_rounds = 0

            last_count = current_count

    try:
        if not click_more_button():
            print("더보기 없음")

        collect_after_more()
    finally:
        driver.quit()

    return results


def print_summary(keyword, results):
    total_count = len(results)
    total_price = sum(item["price"] for item in results)

    print(f"\n검색어: {keyword}")
    print(f"총 {total_count}개 발견")

    if total_count == 0:
        print("가격 없음")
        return

    avg_price = total_price / total_count
    print(f"평균 가격: {int(avg_price):,}원")


if __name__ == "__main__":
    keyword = input("검색어를 입력하세요: ")
    results = search(keyword)
    print_summary(keyword, results)
