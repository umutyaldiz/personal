# AGENT_CONTEXT.md

Bu dosya, `ai-authored-portfolio` projesinin otonom ajanlar tarafından anlaşılmasını ve yönetilmesini kolaylaştırmak amacıyla proje bağlamını, kurallarını ve önemli bilgilerini içerir.

## 1. Proje Mimarisi ve Yapısı

Proje, Vite ile yapılandırılmış modern bir web uygulamasıdır. Temel yapı şöyledir:

-   **`public/`**: Statik dosyalar.
-   **`src/`**: Kaynak kodlarının bulunduğu ana dizin.
    -   **`assets/`**: Resimler, ikonlar gibi varlıklar.
    -   **`components/`**: Yeniden kullanılabilir React bileşenleri.
    -   **`pages/`**: Farklı sayfaları temsil eden bileşenler.
    -   **`App.jsx`**: Ana uygulama bileşeni.
    -   **`main.jsx`**: Uygulamanın giriş noktası.
-   **`index.html`**: HTML ana dosyası.
-   **`package.json`**: Proje bağımlılıkları ve script tanımları.
-   **`vite.config.js`**: Vite yapılandırma dosyası.

Proje, Tailwind CSS v4 ile stilize edilmiştir.