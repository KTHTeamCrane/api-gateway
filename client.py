import requests
import re

url = "https://edition.cnn.com/2024/04/16/\"politics/takeaways-trump-hush-money-trial-day-2/index.html"

res = requests.get("http://127.0.0.1:8000/article/" + url, None)

print(re.sub(r"\\x[A-Fa-f0-9]{2}", "", str(res.content)))