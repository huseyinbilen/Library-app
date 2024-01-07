# Library App
## Uygulama Hakkında
  - Score kısmı için ayrı bir tablo oluşturulmuş ve burdaki değerlerin aritmetik ortalaması alınarak kitap skoru  belirlenmiştir.
 - Validasyon için **joi** paketi kullanılmıştır.
 - Karşılaşılabilecek kullanıcı senaryoları için gerekli hata mesajları eklenmiştir. 
## Kurulum
Öncelikle PostgreSQL ile  ```CREATE DATABASE 'kendiveritabanım' ``` (tırnak içerisine istediğiniz ismi verebilirsiniz.) Bu komut bize yeni bir database oluşturmamızı sağlar. Tablolar ise entity yardımı ile oluşturulmuştur.
 - Yeni bir.env dosyası oluşturmamız gerekiyor. Bu dosya içeriği şöyle olmalıdır; 
```
DB_NAME='databaseisminiz'
DB_USERNAME='PostgreSQL Kullanıcı Adınız'
DB_PASSWORD='PostgreSQL şifreniz'
``` 
bundan sonra ise sırasıyla aşağıdaki komutlar çalıştırılır.
```
npm install
npm run start
```
Uygulamayı kullanmaya başlayabilirsiniz.
## Kullanılan Paketler
- **dotenv**
- **express**
- **pg**
- **typeorm**
- **reflect-metadata**
- **joi**
- **typescript**
- **nodemon**
- **ts-node**
