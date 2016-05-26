# Introdução
O `timer` é um componente para manipular tempos regressivos.

## Como usar

Um componente temporizador é composto por horas, minutos e segundos. Para adicionar um `timer`, escreva:

```html
<div class="ava-timer"></div>
```

Adicione o elemento para mostrar horas restantes: 

```html
<div class="ava-timer">
  <span class="ava-timer__hours"></span>
</div>
```  

Adicione o elemento para mostrar minutos restantes: 

```html
<div class="ava-timer">
  <span class="ava-timer__hours"></span>
  <span class="ava-timer__mins"></span>
</div>
```  

Adicione o elemento para mostrar segundos restantes: 

```html
<div class="ava-timer">
  <span class="ava-timer__hours"></span>
  <span class="ava-timer__mins"></span>
  <span class="ava-timer__secs"></span>
</div>
```  

### Determinando o tempo

O tempo pode ser definido em diversas unidades. Porém, certifique-se de definí-lo em apenas uma. Ordem de preferência:

1. Milisegundos
2. Segundos
3. Minutos
4. Horas

Existem 2 formas diferentes de determinar o tempo a ser contado. 

#### 1. Dataset 

Determina o tempo através de atributos dataset `data-timer`, `data-timer-secs`, `data-timer-mins` ou `data-timer-hours`. Essa forma é mais simples e limitada. Certifique-se de utilizar apenas um dataset.

#### Dataset em milisegundos

```html
<!-- 1 minuto -->
<div class="ava-timer" data-timer="60000">
  <!-- Contagem mostrada. -->
</div>
```  

#### Dataset em segundos

```html
<!-- 1 minuto -->
<div class="ava-timer" data-timer-secs="60">
  <!-- Contagem mostrada. -->
</div>
```  

#### Dataset em minutos

```html
<!-- 1 minuto -->
<div class="ava-timer" data-timer-mins="1">
  <!-- Contagem mostrada. -->
</div>
```  

#### Dataset em horas

```html
<!-- 120 minutos -->
<div class="ava-timer" data-timer-hours="2">
  <!-- Contagem mostrada. -->
</div>
```  

#### 2. Javascript 

Essa forma é mais interativa. Após escrever a marcação do componente, acesse a instância:

```js
// Um temporizador específico.
var timerElement = document.querySelector('.ava-timer');
// Instância do componente.
var timer = timerElement.AvaTimer;
```

#### Definindo em milisegundos

```js 
timer.set(60000); // 1 min.
```

#### Definindo em segundos

```js 
timer.setSecs(60); // 1 min.
```

#### Definindo em minutos

```js 
timer.setMins(1); // 1 min.
```

#### Definindo em horas

```js 
timer.setHours(2); // 120 min.
```

### Inicializando contador

Por padrão, o contador não é inicializado. Para começar a contar o tempo, use:

#### 1. Dataset

Inicializando automaticamente quando o componente for carregado. Use o atributo dataset `data-timer-auto`. 
```html
<!-- 1 minuto -->
<div class="ava-timer" data-timer-mins="1" data-timer-auto>
  <!-- Contagem inicializada automaticamente. -->
</div>
``` 

#### 2. Javascript

Para inicializar dinamicamente utilize o método `start()` do componente. Exemplo:

```html
<!-- 1 minuto -->
<div class="ava-timer" data-timer-mins="1">
  <!-- Contagem inicializada dinamicamente. -->
</div>
``` 

```js
var timer = document.querySelector('.ava-timer').AvaTimer;

window.addEventListener('mousemove', function () {
  // Inicia o contador.
  timer.start();
});
```

### Métodos

Considere:

```js
var timerElement = document.querySelector('.ava-timer');
var timer = timerElement.AvaTimer;
```

#### Definir tempo

Para definir o tempo dinamicamente do contador, use:

```js 
timer.set(6000);
```

#### Iniciar contador

Para iniciar dinamicamente o contador, use:

```js 
timer.start();
```

#### Parar contador

Para congelar dinamicamente o contador, use:

```js 
timer.pause(); 
```

#### Retomar contador

Para retomar o contador após congelado, use:

```js 
timer.start(); 
```

#### Finalizar contador

Para finalizar dinamicamente o contador, use:

```js 
timer.end(); 
```

> O componente invoca automaticamente ao final do tempo.


#### Acessar tempo

Para acessar dinamicamente o valor do contador, use:

```js 
timer.set(3600000); // 60 mins.

timer.getTime(); // 3600000 milisegundos. 
timer.getTimeSecs(); // 3600 segundos. 
timer.getTimeMins(); // 60 minutos. 
timer.getTimeHours(); // 1 hora. 
```

> O componente invoca automaticamente ao final do tempo.

#### Adicionar tempo

Para incrementar o temporizador, use:

```js 
// Tempo definido.
timer.setMins(10); // 10 mins.

timer.add(60000); // 11 mins.
timer.addSecs(60); // 12 mins.
timer.addMins(10); // 22 mins.
timer.addHours(1); // 82 mins.
```

#### Remover tempo

Para decrementar o temporizador, use:

```js 
// Tempo definido.
timer.setMins(10); // 10 mins.

timer.remove(60000); // 9 mins.
timer.removeSecs(60); // 8 mins.
timer.removeMins(10); // falso (abaixo do limite).
timer.removeHours(1); // falso (abaixo do limite).
```

### Eventos

#### No início

Evento disparado apenas quando o contador é inicializado.

```js
var timerElement = document.querySelector('.ava-timer');

timerElement.addEventListener('oninit', function () {
  console.log('Contador foi inicializado.');  
});
```

#### Retomado
Evento disparado sempre que o contador é retomado a partir de outro estado.

```js
var timerElement = document.querySelector('.ava-timer');

timerElement.addEventListener('onstart', function () {
  console.log('Contador foi retomado.');  
});
```

#### Ao parar

Evento disparado sempre que o contador é parado.

```js
var timerElement = document.querySelector('.ava-timer');

timerElement.addEventListener('onpause', function () {
  console.log('Contador foi congelado.');  
});
```

#### Ao final

Evento disparado sempre que o contador é finalizado.

```js
var timerElement = document.querySelector('.ava-timer');

timerElement.addEventListener('onend', function () {
  console.log('O tempo acabou.');  
});
```

### Exemplo de uso

```html
<span class="ava-timer" data-timer-hours="2" data-timer-auto>
    <span class="ava-timer__hours"></span> 
    <span class="ava-timer__mins"></span> 
    <span class="ava-timer__secs"></span> 
</span>
```

```js
// Tempo iniciado automaticamente com 2 horas.
// (...)
var timerElement = document.querySelector('.ava-timer');
var timer = timerElement.AvaTimer;

timerElement.addEventListener('onend', function () {
  console.log('Tempo acabou.');  
});

timerElement.addEventListener('oninit', function () {
  console.log('Contador inicializado.');  
});

timerElement.addEventListener('onpause', function () {
  console.log('Contador parado.');  
});

timerElement.addEventListener('onstart', function () {
  console.log('Contador retomado.');  
});

timerElement.addEventListener('onrestart', function () {
  console.log('Contador reiniciado.');  
});

timer.end();          // "Tempo acabou."

timer.getTime();      // 0

timer.set(60000);

timer.getTime();      // 60000

timer.getTimeMins();  // 1

timer.start();        // "Contador inicializado." 
                      // "Contador retomado."
                      
timer.pause();        // "Contador parado."

timer.addMins(5);

timer.start();        // "Contador retomado." 

timer.getTimeMins();  // 6

timer.removeMins(10); // false

timer.removeMins(1);  // true

timer.getTimeMins();  // 5

timer.restart();      // "Tempo acabou."
                      // "Contador retomado."
                      // "Contador inicializado."
                      // "Contador reiniciado."

timer.getTimeHours(); // 2
```