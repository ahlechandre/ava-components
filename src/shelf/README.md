# Introdução

O `shelf` é um componente que disponbiliza conteúdos a serem visualizados horizontal e verticalmente.

# Como usar

Codifique um elemento com a classe `ava-shelf`:  
```html
<div class="ava-shelf"></div>
```
Insira as ações para mover o conteúdo para esquerda (`.ava-shelf__action-left`) e direita (`.ava-shelf__action-right`):  
```html
<div class="ava-shelf">
  <a href="#" class="ava-shelf__action-left">goes to left</a>
  <a href="#" class="ava-shelf__action-right">goes to right</a>
</div>
```
Coloque o conteúdo a ser disponibiliza dentro da classe `ava-shelf__content`:
```html
<div class="ava-shelf">
  <a href="#" class="ava-shelf__action-left">goes to left</a>
  <a href="#" class="ava-shelf__action-right">goes to right</a>
  <div class="ava-shelf__content">
    <!-- conteúdo aqui. -->
  </div>
</div>
```
  
Adicione a ação de expandir (`.ava-shelf__action-expand`), para disponbilizar o conteúdo verticalmente:
```html
<div class="ava-shelf">
  <a href="#" class="ava-shelf__action-left">goes to left</a>
  <a href="#" class="ava-shelf__action-right">goes to right</a>
  <div class="ava-shelf__content">
    <!-- conteúdo aqui. -->
  </div>
  <a href="#" class="ava-shelf__action-expand">show all</a>
</div>
```
  
