from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import urllib.parse
import re
import time


CHROME_PROFILE = r"C:\temp\guro_profile"


def search(keyword):
    options = webdriver.ChromeOptions()

    options.add_argument(f"--user-data-dir={CHROME_PROFILE}")
    options.add_argument("--profile-directory=Default")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option("useAutomationExtension", False)
    options.add_argument("--start-maximized")

    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=options
    )

    items = []
    seen = set()

    try:
        driver.get("https://www.daangn.com/kr/")
        time.sleep(2)

        url = (
            "https://www.daangn.com/kr/buy-sell/s/"
            f"?search={urllib.parse.quote(keyword)}"
        )
        driver.get(url)
        time.sleep(3)

        while True:
            driver.execute_script("window.scrollBy(0, 1200);")
            time.sleep(2)

            try:
                more_btn = WebDriverWait(driver, 2).until(
                    EC.presence_of_element_located(
                        (
                            By.XPATH,
                            '//button[contains(text(),"더보기")]'
                        )
                    )
                )

                driver.execute_script(
                    "arguments[0].click();",
                    more_btn
                )

                print("더보기 클릭")
                time.sleep(2)

            except:
                break

        cards = driver.find_elements(
            By.CSS_SELECTOR,
            'a[data-gtm="search_article"]'
        )

        print("카드 수:", len(cards))

        for card in cards:
            try:
                item_url = card.get_attribute("href")

                if not item_url:
                    continue

                if item_url in seen:
                    continue

                card_text = card.text

                if "판매완료" in card_text:
                    continue

                price_el = card.find_element(
                    By.CSS_SELECTOR,
                    "span.f1uy1ci"
                )

                price_text = price_el.text
                nums = re.sub(r"[^0-9]", "", price_text)

                if not nums:
                    continue

                price = int(nums)

                seen.add(item_url)

                items.append({
                    "price": price,
                    "url": item_url
                })

            except Exception as e:
                print(e)
                continue

    finally:
        driver.quit()

    return items


def print_summary(keyword, items):
    print(f"\n검색어: {keyword}")
    print(f"총 {len(items)}개 발견")

    if not items:
        return

    avg = sum(i["price"] for i in items) / len(items)
    print(f"평균 가격: {int(avg):,}원")


if __name__ == "__main__":
    keyword = input("검색어: ")
    items = search(keyword)
    print_summary(keyword, items)
