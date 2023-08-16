const webpack = require('webpack')
const [webpackClientConfig, webpackServerConfig] = require('../webpack.config')
const nodemon = require('nodemon')
const path = require ('path')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const express = require('express')

// создаем еще один сервер
const hmrServer = express()
const clientCompiler = webpack(webpackClientConfig)
hmrServer.use(webpackDevMiddleware(clientCompiler, {
    publicPath: webpackClientConfig.output.publicPath,
    // добавляем доп интеграцию dev утилит SSR-у
    // мы как бы обозначаем что тут еще используется SSR
    // и еще (но это не точно) кладем инфу о бандле в request логи 
    serverSideRender: true,    
    // позволяем Webpack Middlewar записывать наш бандл в папку app 
    // просто webpackDevMiddleware рассчитан на работу с devServer и поэтому по-умолчанию не записывает файлы на диск
    writeToDisk: true,
    // как и noInfo выключаем логи успешной компиляции (там много не нужной инфы)
    stats: 'errors-only'
}))

// подключаем к HRM серверу webpackHotMiddleware
hmrServer.use(webpackHotMiddleware(clientCompiler, {
    // путь который позволит серверу отдавать данные с HMR
    path: '/static/__webpack_hmr',
}))

// запускаем сервер
const PORT_HMR =
  process.env.PORT_HMR === "undefined" || process.env.PORT_HMR === undefined
    ? 3001
    : process.env.PORT_HMR;
hmrServer.listen(PORT_HMR, () => {
    console.log(`[dev.js]: сервер HMR успешно запушен на порту ${PORT_HMR}`);
})

const compiler = webpack(webpackServerConfig)

// холодный старт
compiler.run((err) => {
    // ошибка компиляции при холодном старте
    if (err) console.log('[dev.js]: ошибка компиляции при холодном старте: ', err)
    // если на этом этапе ошибок нет - двигаемся дальше
    // в качестве первого аргумента передаются так называемые watch options
    // его оставляем пустым так как дефолтные настройки нас вполне устраивают
    compiler.watch({}, () => {
        if (err) console.log('[dev.js]: ошибка компиляции при слежении за изменениями приложения: ', err)
        console.log('[dev.js]: компиляция прошла успешно');
    })
    // вызываем nodemon как функцию
    nodemon({
        // путь до скрипта который будет запускать nodemon и который будет выполнять сервер
        script: path.resolve(__dirname, '../app/server/server.js'),
        watch: [
            path.resolve(__dirname, '../app/server'),
            path.resolve(__dirname, '../app/client')
        ]
    })
})