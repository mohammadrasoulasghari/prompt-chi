# 🚀 راهنمای نصب آسان Quick Prompt Box

## نصب خودکار با اسکریپت

### روش ۱: دانلود و اجرای مستقیم

```bash
# دانلود و اجرای اسکریپت setup
curl -fsSL https://raw.githubusercontent.com/mohammadrasoulasghari/quick-prompt-box/main/setup.sh | bash
```

### روش ۲: دانلود محلی و اجرا

```bash
# دانلود فایل setup
wget https://raw.githubusercontent.com/mohammadrasoulasghari/quick-prompt-box/main/setup.sh

# اعطای مجوز اجرا
chmod +x setup.sh

# اجرای اسکریپت
./setup.sh
```

## ویژگی‌های اسکریپت Setup

- ✅ **نصب خودکار Docker**: اگر Docker نصب نباشد، خودکار نصب می‌شود
- ✅ **انتخاب پورت**: امکان انتخاب پورت دلخواه یا استفاده از پیش‌فرض (3131)
- ✅ **پیکربندی خودکار**: فایل `.env` خودکار تنظیم می‌شود
- ✅ **اجرای کامل**: پروژه کاملاً آماده و در دسترس خواهد بود

## مراحل اجرا

هنگام اجرای اسکریپت، مراحل زیر انجام می‌شود:

1. **بررسی Docker**: نصب Docker در صورت عدم وجود
2. **دانلود پروژه**: کلون پروژه از GitHub
3. **انتخاب پورت**: سوال از کاربر برای انتخاب پورت
4. **تنظیمات**: ایجاد فایل `.env` با پورت انتخابی
5. **ساخت و اجرا**: build و راه‌اندازی container

## نمونه اجرا

```
🚀 Starting Quick Prompt Box setup...
✅ Docker is already installed.
📥 Cloning the Quick Prompt Box project from GitHub...

🌐 Port Configuration
Default port is 3131. You can change it or press Enter to use default.
Enter port number (default: 3131): 8080

Using custom port: 8080
⚙️  Setting up environment...
🐳 Building and starting the Docker container...
⏳ Waiting for container to start...

🎉 Quick Prompt Box is now running!
🌐 Open your browser and visit: http://localhost:8080
```

## دستورات مفید پس از نصب

```bash
# متوقف کردن
docker compose down

# راه‌اندازی مجدد
docker compose up -d

# مشاهده لاگ‌ها
docker compose logs -f

# مشاهده وضعیت
docker compose ps
```

## متطلبات سیستم

- **سیستم عامل**: Linux/macOS/Windows with WSL2
- **Docker**: نسخه 20.10 یا بالاتر (خودکار نصب می‌شود)
- **حافظه**: حداقل 512MB RAM آزاد
- **فضای دیسک**: حداقل 1GB فضای خالی

## عیب‌یابی

### مشکل در نصب Docker
اگر خطای مجوز دریافت کردید:
```bash
sudo usermod -aG docker $USER
logout  # یا restart کنید
```

### مشکل در دسترسی به پورت
اگر پورت در حال استفاده است:
```bash
# بررسی پورت‌های در حال استفاده
netstat -tulpn | grep :3131

# یا از پورت دیگری استفاده کنید
PORT=8080 docker compose up -d
``` 