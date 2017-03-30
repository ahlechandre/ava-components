# Introdução
O `avatar` é um componente para adicionar, visualizar e atualizar imagens de perfil.

# Como usar

Para adicionar um `avatar`, crie um elemento com a classe `ava-avatar`:

```html
<div class="ava-avatar"></div>
``` 

Em seguida, defina o tamanho com um modificador `ava-avatar--{small|medium|large}`, por exemplo:

```html
<div class="ava-avatar ava-avatar--medium"></div>
``` 

Para definir uma imagem arredondada, use `ava-avatar--rounded`:

```html
<div class="ava-avatar ava-avatar--medium ava-avatar--rounded"></div>
``` 

O componente `avatar` mostra imagens que via atributo `background-image` do CSS. Assim, para adicionar um avatar manualmente, use:

```html
<div class="ava-avatar ava-avatar--medium ava-avatar--rounded" style="background-image: url('avatar.jpg')"></div>
``` 

ou

```html
<style>
.ava-avatar { 
  background-image: url('avatar.jpg');
}
</style>

<div class="ava-avatar ava-avatar--medium ava-avatar--rounded"></div>
``` 

# Avatar com input

É possível que um componente `avatar` seja destinado para entrada de dados do usuário. Para isso, é necessário que o componente tenha um elemento filho `input` com a classe `ava-avatar__input` e receba o modificador `ava-avatar--input`:

```html
<div class="ava-avatar ava-avatar--medium ava-avatar--rounded ava-avatar--input">
  <input type="file" class="ava-avatar__input" accept="image/*"/>
</div>
``` 

Talvez você queira que algum ícone apareça de fundo quando não existir imagem ou a sobreponha quando o `mouse` estiver em cima:

```html
<!-- Componente -->
<div class="ava-avatar ava-avatar--medium ava-avatar--rounded ava-avatar--input">

  <!-- Ícone -->
  <i class="material-icons">add_a_photo</i>

  <!-- Input -->
  <input type="file" class="ava-avatar__input" accept="image/*"/>
</div>
``` 

# Classes

Class | Efeito | Observação
------|--------|-----------
`ava-avatar` | Define um componente `avatar`. | Obrigatório
`ava-avatar--small` | Define o avatar com `60px`. | Opcional
`ava-avatar--medium` | Define o avatar com `120px`. | Opcional
`ava-avatar--large` | Define o avatar com `240px`. | Opcional
`ava-avatar--rounded` | Define o avatar arredondado. | Opcional
`ava-avatar--input` | Define o avatar como sendo modificável pelo o usuário. | Opcional
`ava-avatar__input` | Define o elemento `input` que receberá a nova imagem do usuário | Opcional

# Javascript API

Considere a instância do componente:

```js
var avatarElement = document.querySelector('.ava-avatar');
var Avatar = avatarElement.AvaAvatar;
```

Método | Efeito | Parâmetros | Retorno
-------|--------|------------|--------
`remove()` | Remove a imagem do avatar e limpa o valor do `input` (se houver). |  | `undefined`
`add()` | Abre a janela do sistema operacional para escolha de arquivo caso o componente tenha um input. |  | `undefined`
`getInputValue()` | Retorna o valor do `input` do componente caso exista. |  | `string|null`
`getInputFiles()` | Retorna um `array` com os arquivos do `input` caso exista. |  | `array|null`

# Exemplo de uso

Considere a seguinte estrutura:

```html
<!-- Componente -->
<div class="ava-avatar ava-avatar--medium ava-avatar--rounded ava-avatar--input">

  <!-- Ícone -->
  <i class="material-icons">add_a_photo</i>

  <!-- Input -->
  <input type="file" class="ava-avatar__input" accept="image/*"/>
</div>
``` 

```js
var avatarElement = document.querySelector('.ava-avatar');
var Avatar = avatarElement.AvaAvatar;
// Retorna o valor do input.
Avatar.getInputValue(); // "C:/avatar.jpg"
// Retorna o array de arquivos (caso exista).
Avatar.getInputFiles(); // [File, File, File, ...]
// Retorna o objeto do arquivo selecionado.
Avatar.getInputFiles()[0]; // File
// Retorna o tipo do arquivo selecionado.
Avatar.getInputFiles()[0].type; // "image/jpg"

// Remove o avatar.
Avatar.remove();
Avatar.getInputValue(); // ""
Avatar.getInputFiles(); // []
Avatar.getInputFiles()[0]; // undefined

```

