- [x] setup database
- [x] setup auth
- [x] ui lib
- [x] header básico com navegação
- [ ] crud accountability_log
- [ ] crud category
- [ ] crud de imagens


```sh
turso dev --db-file prisma/dev.db
pnpm dlx prisma generate
pnpm dlx prisma migrate dev --name init
pnpm dlx prisma studio
pnpm dev
``` 