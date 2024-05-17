# Webpack

WebPack é um empacotador de módulos criado para agrupar arquivos JavaScript que estão sendo usados em um navegador.

## Instalação das dependências

- Criação do package.json

    ```bash
    $ npm init -y
    ```

- Edição do arquivo package.json para incluir a propriedade "devDependencies" e os arquivos do webpack.

    ```json
    "devDependencies": {
        "webpack": "^5.91.0",
        "webpack-cli": "^4.7.2"
    }
    ```

- Instalação das dependências listadas no package.json
    ```bash
    $ npm i
    ```

## CommonJS e ES6 (ES2015)

- No formato CommonJS o código é executado sem problemas

    - pessoa.js
        ```javascript
        module.exports = class Pessoa {
            cumprimentar() {
                return 'Bom dia!';
            };
        };
        ```

    - principal.js
        ```javascript
        const Pessoa = require('./pessoa');

        const atendente = new Pessoa;
        console.log(atendente.cumprimentar());
        ```

- No formato ECMAScript 6 (ES2015) precisa do arquivo _webpack.config.js_

    - ./src/pessoa.js
        ```javascript
        export default class Pessoa {
            cumprimentar() {
                return 'Bom dia!';
            };
        };
        ```

    - ./src/principal.js
        ```javascript
        import Pessoa from './pessoa';

        const atendente = new Pessoa;
        console.log(atendente.cumprimentar());
        ```

    - ./webpack.config.js
        ```javascript
        const webpack = require('webpack')

        module.exports = {
            mode: 'development',
            entry: './src/principal.js'
        }
        ```

- O arquivo final será gerado a pasta _./dist_ a partir da execução do comando a seguir:

    ```bash
    $ npm start     # executa script 'start' definido no package.json

    # saída no terminal
    #    > exercicios_webpack@1.0.0 start
    #    > webpack
    #
    #    asset main.js 4.23 KiB [emitted] (name: main)
    #    runtime modules 670 bytes 3 modules
    #    cacheable modules 188 bytes
    #    ./src/principal.js 100 bytes [built] [code generated]
    #    ./src/pessoa.js 88 bytes [built] [code generated]
    #    webpack 5.91.0 compiled successfully in 139 ms
    ```

> Ao mudar no arquivo _webpack.config.js_ a linha _mode_ de 'development' para 'production', o arquivo gerado na pasta _dist_ será um arquivo otimizado e no formato minificado.


## Misturando CommonJS com ES2015

Funciona, mas não é recomendável.

- Criar pasta _modulos_ em src e dentro desta criar:

    - moduloB.js
        ```javascript
        module.exports = {
            saudacao() {
                return 'Olá eu sou o Módulo B!!!';
            }
        };
        ```

    - moduloA.js
        ```javascript
        const moduloB = require('./moduloB');
        console.log(moduloB.saudacao());
        ```

- E Então modificar _principal.js_ ou _pessoa.js_ para importar o moduloA.js

    - principal.js
        ```javascript
        import Pessoa from './pessoa';
        import './modulos/moduloA';

        const atendente = new Pessoa;
        console.log(atendente.cumprimentar());
        ```

- Executando

    ```bash
    $ npm start && node ./dist/main.js

    # Olá eu sou o Módulo B!!!
    # Bom dia!
    ```

## Modificando arquivo e/ou pasta destinoUglifyJS 3: Online JavaScript minifier

É possível definir o nome e/ou a pasta onde o arquivo final será gravado, bastando que isso seja definido no arquivo [webpack.config.js](./webpack.config.js). No exemplo abaixo, o arquivo final será gravado em _./public_ com o nome de _principal.js_.

```javascript
...
output: {
    filename: 'principal.js',
    path: __dirname + '/public'
}
...
```

> __Nota:__ ___dirname_ é uma constante que representa a raiz do projeto.

## Carregando arquivo CSS

Para que o Webpack enxergue um arquivo CSS não basta apenas cria-lo na estrutura de diretórios, ele precisa ser referenciado, ou melhor, importado por algum dos códigos Javascript controlados pelo Webpack.

Então no nosso exemplo, além de criar o arquivo [estilo.css](./src/assets/estilo.css) na pasta _./src/assets_, fizemos a importação deste no arquivo [principal.js](./src/principal.js), e assim, o arquivo CSS "caiu no radar" do Webpack.

```javascript
import Pessoa from './pessoa';
import './modulos/moduloA';
import './assets/css/estilo.css';

const atendente = new Pessoa;
console.log(atendente.cumprimentar());
```

Contudo, ao executar `npm start` diversos erros foram apresentados na tela:

```bash
ERROR in ./src/principal.js 3:0-33
Module not found: Error: Can't resolve './assets/css/estilo.css' in 
```

Tais erros acontecem porque é necessário definir [Loaders](https://webpack.js.org/loaders/) para lidar com o arquivo CSS e outros arquivos, e isso é definido no arquivo [webpack.config.js](./webpack.config.js) na seção _module_:

```javascript
...
module: {
    rules: [
        {
            test: /\.css$/,
            use: [
                'style-loader', // Adiciona CSS a DOM injetando a tag <style>
                'css-loader'     // interpreta @import, url()
            ]
        }
    ]
}
...
```

> Os loaders permitem que o Webpack processe diferentes tipos de arquivos, como JavaScript, CSS, imagens, fontes e muito mais. Eles transformam esses arquivos em módulos que podem ser incluídos no empacotamento final.

É preciso também adicionar as dependências no package.json.
Isso pode ser feito também através do _npm_:

```bash
$ npm i --save-dev css-loader
$ npm i --save-dev style-loader
```

```javascript
...
  "devDependencies": {
    "css-loader": "^7.1.1",
    "style-loader": "^4.0.0",
    "webpack": "^5.91.0",
    "webpack-cli": "^4.7.2"
  }
...
```

E então, ao executar _npm start_ os arquivos serão processados e o conteúdo do CSS será inserido no arquivo [./public/principal.js](./public/principal.js) para que seja injetado via DOM na construção da página.

```bash
$ npm start

# > exercicios_webpack@1.0.0 start
# > webpack
# 
# asset principal.js 25.5 KiB [emitted] (name: main)
# runtime modules 972 bytes 5 modules
# cacheable modules 10.2 KiB
#   modules by path ./node_modules/ 8.15 KiB
#     modules by path ./node_modules/style-loader/dist/runtime/*.js 5.84 KiB 6 modules
#     modules by path ./node_modules/css-loader/dist/runtime/*.js 2.31 KiB
#       ./node_modules/css-loader/dist/runtime/noSourceMaps.js 64 bytes [built] [code generated]
#       ./node_modules/css-loader/dist/runtime/api.js 2.25 KiB [built] [code generated]
#   modules by path ./src/ 2.01 KiB
#     modules by path ./src/*.js 251 bytes 2 modules
#     modules by path ./src/modulos/*.js 160 bytes 2 modules
#     modules by path ./src/assets/css/*.css 1.61 KiB 2 modules
# webpack 5.91.0 compiled successfully in 1270 ms
```


Inclusive se criar na pasta _./src/public_ um arquivo [index.html](./public/index.html) e importar esse arquivo [principal.js](./public/principal.js) veremos o que foi definido em [estilo.css](./src/assets/css/estilo.css) sendo aplicado na página, no caso, um background vermelho.

#### Conteúdo do index.html para teste
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Capítulo Webpack</title>
</head>
<body>
    <script src="principal.js"></script>
</body>
</html>
```

## Externalizando o arquivo CSS

No tópico anterior, através do _loader_ `style-loader` fizemos com que o CSS fosse inserido no arquivo _principal.js_ e injetado no HTML utilizando o DOM.

E se quisermos que após o processamento do Webpack o CSS seja mantido em um arquivo separado?

Para isso utilizamos o plugin [MiniCssExtractPlugin](https://webpack.js.org/plugins/mini-css-extract-plugin/), que requer ajuste no arquivo [webpack.config.js](./webpack.config.js) e a instalação de uma nova dependência. Veja a seguir:

#### webpack.config.js
_Style-loader_ e _MiniCssExtractPlugin_ são duas formas diferentes de lidar com arquivos CSS e, portanto, conflitantes. Para usar _MiniCssExtraPlugin_ é preciso comentar _Style-loader_.

```javascript
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: 'development',
    // mode: 'production',
    entry: './src/principal.js',
    output: {
        filename: 'principal.js',
        path: __dirname + '/public'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'estilo.css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    // 'style-loader', // Adiciona CSS a DOM injetando a tag <style>
                    MiniCssExtractPlugin.loader,
                    'css-loader'       // interpreta @import, url()
                ]
            }
        ]
    }
}
```

#### Dependência _MiniCssExtractPlugin_

Para instalar a dependência, proceda conforme a seguir:

```bash
$ npm install --save-dev mini-css-extract-plugin
```

E esta será a nova configuração do package.json:

```javascript
  "devDependencies": {
    "css-loader": "^7.1.1",
    "mini-css-extract-plugin": "^2.9.0",
    "style-loader": "^4.0.0",
    "webpack": "^5.91.0",
    "webpack-cli": "^4.7.2"
  }
```

E então basta novamente executar `npm start` para recriar os arquivos na pasta public, agora também o arquivo _estilo.css_.

#### Ajuste no index.html para teste

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="estilo.css">
    <title>Capítulo Webpack</title>
</head>
<body>
    <script src="principal.js"></script>
</body>
</html>
```

## Carregando arquivo SCSS (SASS)

#### Dependências
Primeiramente é necessário instalar as dependências:

```bash
$ npm install sass-loader sass --save-dev
```

E então o package.json fica assim:

```json
{
  ...
  "devDependencies": {
    "sass": "^1.77.2",
    "sass-loader": "^14.2.1",
    "mini-css-extract-plugin": "^2.9.0",
    "css-loader": "^7.1.1",
    "style-loader": "^4.0.0",
    "webpack": "^5.91.0",
    "webpack-cli": "^4.7.2"
  }
  ...
}
```
#### webpack.config.js
É preciso também fazer algumas mudanças no arquivo _webpack.config.js_ ficando conforme abaixo:

```javascript
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: 'development',
    // mode: 'production',
    entry: './src/principal.js',
    output: {
        filename: 'principal.js',
        path: __dirname + '/public'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'estilo.css'
        })
    ],
    module: {
        rules: [
            {
                // test: /\.css$/i,                // REGEX casa CSS
                test: /\.s?[ac]ss$/i,              // REGEX casa CSS, SCSS e SASS
                use: [
                    // 'style-loader',             // Adiciona CSS a DOM injetando a tag <style>
                    MiniCssExtractPlugin.loader,
                    'css-loader',                   // interpreta @import, url()
                    'sass-loader',
                ]
            }
        ]
    }
}
```

#### Arquivos para testes com SCSS (SASS)
Para testarmos o webpack com arquivos _.SCSS_ vamos criar em _/src/assets/scss_ os arquivos _botao.scss_ e _index.scss_:

- _index.scss_
    ```scss
    $cor-botao-padrao: #fff;
    $cor-bg-botao-padrao: #19b3e6;

    @import 'botao'
    ```

- _botao.scss_
    ```scss
    .botao {
        background-color: $cor-bg-botao-padrao;
        color: $cor-botao-padrao;
        font-size: 1.5em;
    }
    ```

Se executarmos `npm run start` nada vai acontecer pois não há nada fazendo referência a estes arquivos _scss_. Vamos então referência-lo.

Sempre que fazemos o import de uma pasta, o Javascript procura por um arquivo _index.js_ nesta pasta importada. Então vamos criar um novo arquivo _index.js_ dentro da pasta _/src/assets_ e este arquivo é quem fará as importações tanto de _CSS_ quanto de _SCSS_ quando ele for importado no arquivo _principal.js_


- _/src/assets/index.js_:

    ```javascript
    // Este arquivo é quem de fato faz as importações

    import './css/estilo.css';
    import './scss/index.scss';
    ```

- _/src/principal.js_:

    ```javascript
    import Pessoa from './pessoa';
    import './modulos/moduloA';

    // import './assets/css/estilo.css';
    import './assets'   // busca pelo index.js existente na pasta

    const atendente = new Pessoa;
    console.log(atendente.cumprimentar());
    ```

#### Executando o teste

Agora, ao executar _npm run start_ os arquivos serão processados e teremos na pasta _public_ o arquivo _estilo.css_ também com o conteúdo obtido a partir do arquivo _SCSS_:

```CSS
/*!********************************************************************************************************************!*\
  !*** css ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/assets/css/estilo.css ***!
  \********************************************************************************************************************/
body {
  background-color: red;
}
/*!*********************************************************************************************************************!*\
  !*** css ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/assets/scss/index.scss ***!
  \*********************************************************************************************************************/
.botao {
  background-color: #19b3e6;
  color: #fff;
  font-size: 1.5em;
}
```

Podemos então alterar o arquivo [public/index.html](./public/index.html) para testar essa classe `.botão`. Com esta alteração basta abrir em um navegador e ver o resultado.

> Digite `file://` na barra de endereços do navegador para explorar os arquivos do seu disco local.


```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="estilo.css">
    <title>Capítulo Webpack</title>
</head>
<body>
    <button class="botao">Teste</button>    <!-- Testar a classe botao -->
    <script src="principal.js"></script>
</body>
</html>
```

## Build para Desenvolvimento e Build para Produção

Vamos aqui fazer os ajustes necessários para que possamos ter duas formas de gerar os arquivos, sendo uma para desenvolvimento e outra para produção, esta última com otimizações e minificações de todos os arquivos.

#### Dependências necessárias

```bash
# gerência de variáveis ambiente multiplataforma (Linux, Win, Mac)
$ npm i cross-env --save-dev

# substitui Optimize CSS Assets Webpack Plugin
$ npm install css-minimizer-webpack-plugin --save-dev

# substitui UglifyJS Webpack Plugin
$ npm install terser-webpack-plugin --save-dev
```

Com isso temos uma atualização do arquivo [package.json](./package.json) que também recebeu a nova linha de script `build` que faz uso do NODE-ENV para definir a variável de ambiente `production`:

```json
{
  "name": "exercicios_webpack",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "webpack",
    "build": "cross-env NODE_ENV=production webpack"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "devDependencies": {
    "cross-env": "^7.0.3",
    "css-loader": "^7.1.1",
    "css-minimizer-webpack-plugin": "^7.0.0",
    "mini-css-extract-plugin": "^2.9.0",
    "sass": "^1.77.2",
    "sass-loader": "^14.2.1",
    "style-loader": "^4.0.0",
    "terser-webpack-plugin": "^5.3.10",
    "webpack": "^5.91.0",
    "webpack-cli": "^4.7.2"
  }
}
```

E precisamos também fazer algumas alterações no arquivo [webpack.config.js](./webpack.config.js), para setar o build de desenvolvimento ou produção com base na variável de ambiente setada pelo _NODE-ENV_ e acrescentando novas importações de plugins:

```javascript
const modoDev = process.env.NODE_ENV !== 'production';

const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {

    mode: modoDev ? 'development' : 'production',   // uso de NODE_ENV
    // mode: 'development',
    // mode: 'production',

    entry: './src/principal.js',
    output: {
        filename: 'principal.js',
        path: __dirname + '/public',
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'estilo.css',
        }),
    ],
    module: {
        rules: [
            {
                // test: /\.css$/i,                // REGEX casa CSS
                test: /\.s?[ac]ss$/i,              // REGEX casa CSS, SCSS e SASS
                use: [
                    // 'style-loader',             // Adiciona CSS a DOM injetando a tag <style>
                    MiniCssExtractPlugin.loader,
                    'css-loader',                  // interpreta @import, url()
                    'sass-loader',
                ],
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
              parallel: true,
            }),
            // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
            `...`,
            new CssMinimizerPlugin(),
        ],
    },
};
```

#### Executando o build

Com as alterações acima, temos duas formas de fazer o build do projeto:
```bash
# build de desenvolvimento
$ npm start  # (também npm run start)

# build de produção
$ npm run build
```

## Carregando Arquivos de Imagem

Antes do webpack 5 era necessário configurar um _file-loader_ no [webpack.config.js](./webpack.config.js), mas a partir da versão 5 são utilizados `Asset Modules` que dispensam qualquer loader adicional.

[Saiba mais sobre os Asset Modules](https://webpack.js.org/guides/asset-modules/)

Como exemplo, vamos criar um arquivo em _/src/assets/images_ com o nome de [logo.png](./src/assets/images/logo.png) e referencia-lo em [estilo.css](./src/assets/css/estilo.css). Com isso, _css-loader_ vai sinalizar ao webpack sobre a existência deste arquivo de imagem.

- estilo.css
```css
body {
    background-color: #444;
    background-image: url(../images/logo.png);
    background-repeat: no-repeat;
    background-position: center;
    height: 100vh;
}
```

Após estas alterações, ao executar `npm start` o arquivo de imagem será também levado para a pasta public.


## Adicionando um WebServer de Desenvolvimento
Podemos adicionar um servidor que além de disponibilizar o acesso no navegador, também faz build e reload automaticamente.

#### Dependências
É preciso instalar a dependência do webpack-dev-server.

Na primeira tentativa fiz a instalação pelo terminal (comando abaixo). Foi instalada a última versão (versão 5) mas ocorreram alguns problemas ao tentar executar.
```bash
$ npm install --save-dev webpack-dev-server
```

Pesquisando, encontrei uma dica de instalar uma versão específica do servidor. Para isso, precisei apagar a pasta `node_modules`, e incluir manualmente a dependência do servidor no arquivo [package.json](./package.json) e então mandar instalar todas as dependências novamente.

> Note no arquivo _package.json_ a alteração no script _start_ para chamar o _webpack server_.

- package.json
    ```json
    {
        "name": "exercicios_webpack",
        "version": "1.0.0",
        "main": "index.js",
        "scripts": {
            "start": "webpack serve",
            "build": "cross-env NODE_ENV=production webpack"
        },
        "keywords": [],
        "author": "",
        "license": "ISC",
        "description": "",
        "devDependencies": {
            "cross-env": "^7.0.3",
            "css-loader": "^7.1.1",
            "css-minimizer-webpack-plugin": "^7.0.0",
            "mini-css-extract-plugin": "^2.9.0",
            "sass": "^1.77.2",
            "sass-loader": "^14.2.1",
            "style-loader": "^4.0.0",
            "terser-webpack-plugin": "^5.3.10",
            "webpack": "^5.91.0",
            "webpack-cli": "^4.7.2",
            "webpack-dev-server": "^4.15.1"
        }
    }
    ```
- instalação das dependências
    ```bash
    $ npm i   # (ou npm install)
    ```

Com essas alterações, ao executar `npm run start` será feito o build e iniciado o servidor, e a página estará disponível no navegador acessando: [http://localhost:9000](http://localhost:9000).

## Saiba Mais

- [Módulos em JavaScript: ES Modules vs. CommonJS](https://pt.linkedin.com/pulse/m%C3%B3dulos-em-javascript-es-modules-vs-commonjs-herlon-costa-4wuhf)

- [O Guia do ES6: TUDO que você precisa saber](https://medium.com/@matheusml/https://velx.com.br/5-passos-basicos-do-webpack-para-iniciantes/o-guia-do-es6-tudo-que-voc%C3%AA-precisa-saber-8c287876325f)

- [Webpack :: Getting Started](https://webpack.js.org/guides/getting-started/)

- [Webpack :: Loaders](https://webpack.js.org/loaders/)

- [Webpack :: Writing a Loader](https://webpack.js.org/contribute/writing-a-loader/)

- [Webpack :: MiniCssExtractPlugin](https://webpack.js.org/plugins/mini-css-extract-plugin/)

- [Webpack :: Sass-loader](https://webpack.js.org/loaders/sass-loader/)

- [Webpack :: CssMinimizerWebpackPlugin](https://webpack.js.org/plugins/css-minimizer-webpack-plugin/)

- [Webpack :: TerserWebpackPlugin](https://webpack.js.org/plugins/terser-webpack-plugin/)

- [Webpack :: Webpack-dev-server](https://webpack.js.org/configuration/dev-server/)

- [Introdução ao Webpack dev server: guia para desenvolvimento ágil](https://velx.com.br/introducao-ao-webpack-dev-server/)

- [5 Passos Básicos do Webpack para Iniciantes](https://velx.com.br/5-passos-basicos-do-webpack-para-iniciantes/)

- [REGEX: Crie e teste de forma online e interativa](https://regex101.com/)

- [How to Check and Set the NODE_ENV Environment Variable and Its Use in a Project](https://medium.com/@zouyu1121/how-to-check-and-set-the-node-env-environment-variable-and-its-use-in-a-project-1fd70eb0b5a1)

- [How can I use the npm package "cross-env" to manage environment variables in a Node.js project?](https://www.mend.io/free-developer-tools/a/community/secure-coding/how-can-i-use-the-npm-package-cross-env-to-manage-environment-variables-in-a-node-js-project/)

- [Uso do cross-env para controlar o ambiente](https://materialpublic.imd.ufrn.br/curso/disciplina/3/78/9/3)

- [Variáveis de Ambiente: O que São e Como Utilizá-las](https://kinsta.com/pt/base-de-conhecimento/o-que-sao-variaveis-de-ambiente/)

- [Bun: O JavaScript Runtime mais ágil, versátil e prático. "Node.js killer"](https://pt.linkedin.com/pulse/bun-o-javascript-runtime-mais-%C3%A1gil-vers%C3%A1til-e-pr%C3%A1tico-henrique-gomes)

- [UglifyJS 3: Online JavaScript minifier](https://skalman.github.io/UglifyJS-online/)