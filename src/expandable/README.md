# Introdução

O `expandable` é um componente que disponbiliza conteúdos a serem expandíveis.

# Como usar

Codifique um elemento com a classe `ava-expandable`:  
```html
<div class="ava-expandable"></div>
```
Use o modificador `ava-expandable--table` caso o conteúdo a ser oculto seja linhas de tabela:  
```html
<div class="ava-expandable ava-expandable--table">
  <!-- conteúdo em tabela. -->
</div>
```
Coloque o conteúdo a ser oculto e, posteriormente, expandível dentro da classe `ava-expandable__content`:
```html
<div class="ava-expandable">
  <div class="ava-expandable__content">
    <!-- conteúdo aqui. -->
  </div>
</div>
```
  
Adicione a ação de expandir (`.ava-expandable__action`), para visualizar o conteúdo oculto:
```html
<div class="ava-expandable">
  <div class="ava-expandable__content">
    <!-- conteúdo aqui. -->
  </div>
  <a href="#" class="ava-expandable__action">mostrar conteúdo</a>
</div>
```
  
