# Introdução
O `dialogable` é um componente para manipular o carregamento dinâmico de conteúdo em janelas de diálogo (ou modal, dialog) através de requisições assíncronas ao servidor.

## Como usar

Cada componente `dialogable` é composto por um *trigger* (link) que dispara a chamada para o *dialog* (modal) no evento de `click`. 

Para usar o componente, declare o dialog com seu elemento para receber o conteúdo e os botões de ação:

```html
<div id="filtro" class="ava-dialog">
  <div class="ava-dialog__content">
    <!-- Conteúdo carregado dinamicamente. -->
  </div>
  <div class="ava-dialog__actions">
    <!-- Botões de ação. -->
  </div>
</div>
```

Insira o trigger com o atributo `href` referenciando o atributo `id` do dialog: 

```html
<a href="#filtro" class="ava-dialogable">Filtro</a>
```

Esses são os requisitos básicos para iniciar uma nova instância do componente `dialoable`. É possível acessar essa instância:

```js
// Elemento (link) do componente.
var trigger = document.querySelector('.ava-dialogable');
// Instância do componente.
var dialogable = trigger.AvaDialogable;
// Verifica se o conteúdo está carregado.
var loaded = dialogable.isLoaded();
console.log(loaded); // @type {boolean}
```

Entretanto, o `modal` é dependente das funcionalidades do Materialize.

Então, complemente o dialog com as classes definidas pelo framework e outras dependências:

```html
<div id="#filtro" class="ava-dialog modal modal-fixed-footer" data-ava-modal>
  <div class="ava-dialog__content modal-content">
    <!-- Conteúdo carregado dinamicamente. -->
  </div>
  <div class="ava-dialog__actions modal-footer">
    <!-- Botões de ação. -->
  </div>
</div>
```

### Carregamento do conteúdo

O conteúdo sempre é inserido no elemento `.ava-dialog__content`.

Para carregar o conteúdo é necessário definir a `url`. 

### Definindo a URL

Existem 3 formas de definir a `url` do conteúdo no dialog.

#### 1. Dataset
Essa forma é a mais simples e simula a declaração de um `iframe`.

No trigger, defina a propriedade dataset `data-dialog-url` com o valor da `url` referente ao conteúdo a ser carregado assíncronamente:

```html
<a href="#filtro" class="ava-dialogable" data-dialog-url="themes/ava/assets/content/modal.html">
Filtro
</a>
```

#### 2. Javascript && Dinâmico (Recomendado)

Essa forma não mistura o endereço `url` na marcação HTML, como em *dataset*.

Para definir dinamicamente o endereço do conteúdo, acesse a instância do componente `dialogable` e atribua a propriedade `contentUrl`: 

```js
var trigger = document.querySelector('.ava-dialogable');
var dialogable = trigger.AvaDialogable;
dialoable.contentUrl = 'content.html'
```

> Dialogable automaticamente  irá disparar o evento de click e utilizará essa `url` na requisição.

#### 3. Javascript && Manual

Talvez você deseja definir manualmente carregamento do conteúdo.

Para isso, use:

```js
var trigger = document.querySelector('.ava-dialogable');
var dialogable = trigger.AvaDialogable;
// Desativa o carregamento padrão por click para evitar conflito.
dialoable.disableDefaultBehavior();
dialoable.getContent('content.html'); 
```

### Callbacks

As opções a seguir consideram o componente:

```js
var trigger = document.querySelector('.ava-dialogable');
var dialogable = trigger.AvaDialogable;
```

> Os `callbacks` são adicionais e não substituem as funções padrão definidas pelo componente. 

#### Sucesso

Requisição respodida com sucesso pelo servidor:

```js
dialoable.onContentSuccess = function (response) {
  console.log(response);  
};
```

#### Completo
Sempre será invocado ao final da requisição:

```js
dialoable.onContentComplete = function () {
  console.log('Requisição finalizada.');  
};
```

#### Error
Requisição com erro:

```js
dialoable.onContentError = function (error) {
  
  if (error.status === 404) {
    console.log('Conteúdo não encontrado.');
  }
};
```

### Métodos adicionais

#### Desativar carregamento padrão

Para desativar o carregamento padrão do conteúdo no evento de `click` criado pelo componente, invoque:

```js
// (...)
dialogable.disableDefaultBehavior();
```

#### Ativar carregamento padrão

Para ativar o carregamento padrão do conteúdo no evento de `click` criado pelo componente, invoque:

> Por padrão, essa opção é ativa.

```js
// (...)
dialogable.enableDefaultBehavior();
```
