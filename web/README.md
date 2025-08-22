- [x] setup database
- [x] setup auth
- [x] ui lib
- [ ] crud accountability_log
- [ ] crud user
- [ ] crud category


```sh
turso dev --db-file prisma/dev.db
pnpm dlx prisma generate
pnpm dlx prisma migrate dev --name init
pnpm dlx prisma studio
pnpm dev
``` 