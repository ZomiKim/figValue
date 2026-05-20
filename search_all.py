from collector import query_and_save


def main():
    keyword = input("검색어를 입력하세요: ")
    query_and_save(keyword)


if __name__ == "__main__":
    main()
