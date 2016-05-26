# Introdução

Tabs é um componente para alternar entre diferentes *views*.

# Como usar

Para criar um componente de tabs, escreva uma lista com a classe `ava-tabs`:

```html
<ul class="ava-tabs">
  <!-- items -->
</ul>
```

Insira cada item da lista com a classe `ava-tabs__item`:

```html
<ul class="ava-tabs">
  <li class="ava-tabs__item">
    <!-- conteúdo -->
  </li>
  <li class="ava-tabs__item">
    <!-- conteúdo -->
  </li>
</ul>
```

Cada item da tab contém um *link* com a classe `ava-tabs__link` e o atributo `href` aponta para o `id` do elemento a ser mostrado.

Além disso, cada *link* contém um elemento `span` com a classe `ava-tabs__item-text` para definir o título e, opcionalmente, um ícone com a classe `ava-tabs__item-icon`:
 
```html
<ul class="ava-tabs">
  <li class="ava-tabs__item">
    <a class="ava-tabs__link" href="#tab-1" >
      <span class="ava-tabs__item-text">Tab 1</span>
      <!-- Opcional -->
      <span class="ava-tabs__item-icon">
        <i class="material-icons">star</i>
      </span>
    </a>
  </li>

  <li class="ava-tabs__item">
    <a class="ava-tabs__link" href="#tab-2">
      <span class="ava-tabs__item-text">Tab 2</span>
      <!-- Opcional -->
      <span class="ava-tabs__item-icon">
        <i class="material-icons">add</i>
      </span>
    </a>
  </li>
</ul>

<div id="tab-1">Conteúdo da tab 1</div>
<div id="tab-2">Conteúdo da tab 2</div>
```

## Modificadores

### Mostrar apenas ícones
Adicione o modificador `ava-tabs--icons` à lista:

```html
<ul class="ava-tabs ava-tabs--icons">
  <li class="ava-tabs__item">
    <!-- conteúdo -->
  </li>
  <li class="ava-tabs__item">
    <!-- conteúdo -->
  </li>
</ul>
``` 

### Tab desativa
Adicione a classe `disabled` ao item escolhido:
 
```html
<ul class="ava-tabs">
  <li class="ava-tabs__item disabled">
    <!-- conteúdo -->
  </li>
  <li class="ava-tabs__item">
    <!-- conteúdo -->
  </li>
</ul>
```

## Dependencia 

O componente possui dependência do Materialize. Então, complemente os elementos com as seguintes classes:

```html
<ul class="ava-tabs tabs">
  <li class="ava-tabs__item tab">
    <!-- conteúdo -->
  </li>
  <li class="ava-tabs__item tab">
    <!-- conteúdo -->
  </li>
</ul>
```

### Selecionar tab

Existem duas formas de selecionar uma tab.

#### 1. Manualmente
Especificado na marcação do componente. Adicione a classe `active` ao link a ser selecionado. 

```html
<ul class="ava-tabs tabs">
  <li class="ava-tabs__item tab">
    <a class="ava-tabs__link" href="#tab-1">
      <!-- (...) -->
    </div>
  </li>
  <li class="ava-tabs__item tab">
    <a class="ava-tabs__link active" href="#tab-2">
      <!-- (...) -->      
    </div>
  </li>
</ul>
```

#### 2. Dinamicamente

Acesse a instância do componente e invoque o método `active` passando o `id` do conteúdo a ser mostrado:

```js
var tabsElement = document.querySelector('.ava-tabs');
var tabsComponent = tabsElement.AvaTabs;
tabsComponent.active('tab-2');
```

