# simple_crawler.py
import requests
from bs4 import BeautifulSoup

def crawl(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    print("Title:", soup.title.string)

crawl("https://example.com")
