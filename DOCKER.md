# راهنمای اجرای Docker

این پروژه با Docker پشتیبانی کامل می‌شود و امکان تنظیم پورت از طریق متغیرهای محیطی (Environment Variables) را دارد.

## متطلبات

- Docker
- Docker Compose (یا Docker Desktop)

## اجرای سریع

```bash
# اجرا روی پورت پیش‌فرض (3131)
docker compose up -d

# یا اجرا روی پورت دلخواه
PORT=8080 docker compose up -d
```

## متغیرهای محیطی قابل تنظیم

| متغیر | پیش‌فرض | توضیح |
|-------|---------|-------|
| `PORT` | `3131` | پورت اجرای برنامه |
| `HOST` | `0.0.0.0` | آدرس host برای bind شدن |

## مثال‌های استفاده

### اجرا روی پورت 3000
```bash
PORT=3000 docker compose up -d
```

### اجرا روی پورت 8080
```bash
PORT=8080 docker compose up -d
```

### مشاهده وضعیت
```bash
docker compose ps
```

### مشاهده لاگ‌ها
```bash
docker compose logs -f app
```

### متوقف کردن
```bash
docker compose down
```

## بیلد مجدد

اگر تغییراتی در کد اعمال کردید:

```bash
docker compose up --build -d
```

## تست دسترسی

پس از اجرا، برنامه در آدرس زیر قابل دسترسی است:

```
http://localhost:PORT
```

مثال:
- پورت پیش‌فرض: http://localhost:3131
- پورت سفارشی: http://localhost:8080

## عیب‌یابی

### مشکل در اجرا
```bash
# مشاهده لاگ‌های کامل
docker compose logs app

# ورود به container برای بررسی
docker exec -it quick-prompt-box-app-1 sh
```

### پاک کردن کامل
```bash
# حذف containers، networks و images
docker compose down --rmi all --volumes
``` 