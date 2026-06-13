"""
Django settings for backend project.
"""

from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent


# ========================
# SECURITY
# ========================

SECRET_KEY = 'django-insecure-tss-wsy&yyxy3y5imrpgc5$%hm(s5+g9-^fi8tonnno3*qeogw'

DEBUG = False

ALLOWED_HOSTS = [
        "hafiz899.pythonanywhere.com",
        "www.hafiz899.pythonanywhere.com",
        "127.0.0.1",
        "localhost",
]


# ========================
# APPLICATIONS
# ========================

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'foodordering',
]


# ========================
# MIDDLEWARE (IMPORTANT ORDER)
# ========================

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",

    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",

    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]



# ========================
# CORS
# ========================

CORS_ALLOW_ALL_ORIGINS = False

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://food-ordering-system-h3c9.vercel.app",
]

CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    "https://food-ordering-system-h3c9.vercel.app",
]

CORS_ALLOW_ALL_ORIGINS = True
print("SETTINGS FILE LOADED")

# ========================
# URL CONFIG
# ========================

ROOT_URLCONF = 'backend.urls'


# ========================
# TEMPLATES (FIXED FOR REACT)
# ========================

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR.parent / "frontend/build"],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


# ========================
# WSGI
# ========================

WSGI_APPLICATION = 'backend.wsgi.application'


# ========================
# DATABASE
# ========================

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# ========================
# PASSWORD VALIDATION
# ========================

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# ========================
# INTERNATIONALIZATION
# ========================

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Karachi'
USE_I18N = True
USE_TZ = True


# ========================
# STATIC FILES (CRITICAL FIX)
# ========================

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

STATICFILES_DIRS = [
    BASE_DIR / "frontend/build/static"
] if (BASE_DIR / "frontend/build/static").exists() else []

# IMPORTANT FOR DJANGO ADMIN + WHITENOISE
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"


# ========================
# MEDIA FILES
# ========================

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'


# ========================
# DEFAULT AUTO FIELD
# ========================

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'