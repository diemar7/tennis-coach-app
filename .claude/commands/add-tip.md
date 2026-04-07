Vamos a agregar el próximo tip del banco a la app.

1. Leé `docs/tips-bank.md` y encontrá el primer tip marcado como `[LIBRE]`.

2. Leé `lib/tips.ts` para ver el array actual de tips.

3. Agregá el nuevo tip al array `TIPS` en `lib/tips.ts` con el formato existente:
   ```ts
   {
     id: <próximo número>,
     categoria: '<categoría del tip>',
     titulo: '<título>',
     cuerpo: '<cuerpo>',
   }
   ```

4. En `docs/tips-bank.md`, cambiá el estado del tip de `[LIBRE]` a `[USADO]`.

5. Hacé commit con mensaje descriptivo y push a main.

6. Mostrá un resumen: qué tip se agregó, cuántos tips tiene ahora la app, y cuántos libres quedan en el banco.
