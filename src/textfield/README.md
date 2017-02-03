# Introdução
O `textfield` é um componente para manipular campos de texto.

# Como usar

Para adicionar um `textfield`, crie um elemento com a classe `ava-textfield`:

```html
<div class="ava-textfield"></div>
``` 

Em seguida, adicione o *input*  com a classe `ava-textfield__input`:

```html
<div class="ava-textfield">
  <input class="ava-textfield__input" type="text">
</div>
```

Caso o `input` seja multilinha, adicione o elemento de `textfield` com a classe `ava-textfield__input` e o modificador `ava-textfield__input--multiline`, além disso, acrescente a classe `materialize-textarea`:

```html
<div class="ava-textfield">
  <textarea class="ava-textfield__input ava-textfield__input--textarea materialize-textarea"></textarea>
</div>
```

Adicione um *label* para o campo com a classe `ava-textfield__label`:

```html
<div class="ava-textfield">
  <input class="ava-textfield__input" type="text">
  <label class="ava-textfield__label">Texto</label>
</div>
```

Complemente o *input* com um `id` e o *label* com o atributo `for`:

```html
<div class="ava-textfield">
  <input class="ava-textfield__input" type="text" id="text-field">
  <label class="ava-textfield__label" for="text-field">Texto</label>
</div>
```


# Classes

Class | Efeito | Observação
------|--------|-----------
`ava-textfield` | Define um componente `textfield`. | Obrigatório
`ava-textfield__input` | Define o *input*. | Obrigatório
`ava-textfield__input--multiline` | Define o *input* como multiline. | Opcional
`ava-textfield__label` | Define o *label* do tipo *input*. | Obrigatório

# Javascript API

Considere a instância do componente:

```js
var textfieldElement = document.querySelector('.ava-textfield');
var textfield = textfieldElement.AvaTextfield;
```

Método | Efeito | Parâmetros | Retorno
-------|--------|------------|--------
`autoresize()` | Redimensiona o campo caso seja multilinha. | | `undefined`
`create()` | Inicializa dinamicamente o campo. | | `undefined`
`clear()` | Define o valor do campo como vazio. | | `undefined`
`destroy()` | Destrói dinamicamente o campo. | | `undefined`
`update()` | Destrói e inicializa dinamicamente o campo. | | `undefined`
`setValue(value)` | Define o valor do campo atualiza o componente. | `string` | `undefined`

# Exemplo de uso

```js
var textfieldElement = document.querySelector('.ava-textfield');
var textfield = textfieldElement.AvaTextfield;
// Atualiza dinamicamente o campo.
textfield.update();
// Define o valor do campo.
textfield.setValue('Texto aqui');
// Define o valor do campo como vazio.
textfield.clear();
```
## Redimensionando

Quando o valor de um campo multilinha (`textarea`) é definido dinamicamente, sua altura deve ser redimensionada. Para isso, podemos utilizar o método `autoresize` ou definir o valor através de `setValue(value)`. 

Considere o `textfield` abaixo:

```html
<div class="ava-textfield" id="my-textfield-multiline">
  <textarea id="my-textarea" class="ava-textfield__input ava-textfield__input--multiline materialize-textarea"></textarea>
  <label class="ava-textfield__label" for="my-textarea">Multiline</label>
</div>
```

### autoresize

Com o método `autoresize` é possível redimensionar a altura do `textfield`:

```js
var textfieldElement = document.querySelector('.ava-textfield#my-textfield-multiline');
var MyTextfield = textfieldElement.AvaTextfield;

// Definindo o valor do input multilinha (`textarea`) diretamente através de seu atributo `value`.
textfieldElement.value = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel eros vitae nisl dignissim rhoncus. Morbi pellentesque lorem eu ex semper rutrum. Curabitur nec lacus a massa tristique posuere ac nec libero. Aliquam et consequat ex. Aliquam iaculis sed nunc et tempus. Morbi vehicula sapien sed ipsum posuere sodales non id mauris. In semper pulvinar viverra. Phasellus nec magna eleifend, luctus purus et, accumsan magna. Praesent sit amet nibh pellentesque, eleifend nisl id, venenatis lacus. Cras sed tempus elit.'

// Redimensionando manualmente a nova altura do textfield. 
MyTextfield.autoresize();
```

### setValue

Para que a altura seja redimensionada automaticamente, utilize o método `setValue` para alterar o valor do input:

```js
var textfieldElement = document.querySelector('.ava-textfield#my-textfield-multiline');
var MyTextfield = textfieldElement.AvaTextfield;

// Define dinamicamente o valor do campo com a sua altura redimensionada.
MyTextfield.setValue('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel eros vitae nisl dignissim rhoncus. Morbi pellentesque lorem eu ex semper rutrum. Curabitur nec lacus a massa tristique posuere ac nec libero. Aliquam et consequat ex. Aliquam iaculis sed nunc et tempus. Morbi vehicula sapien sed ipsum posuere sodales non id mauris. In semper pulvinar viverra. Phasellus nec magna eleifend, luctus purus et, accumsan magna. Praesent sit amet nibh pellentesque, eleifend nisl id, venenatis lacus. Cras sed tempus elit.');
```
