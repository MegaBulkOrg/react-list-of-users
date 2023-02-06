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
    // чтобы вся инфа Webpack-а о сборке не сыпалась в консоль, а лишь та что нужно
    noInfo: true,
    // чтобы не отслеживались изменения в папке с готовым приложением
    watchOptions: {ignore: /app/},
    // позволяем Webpack Middlewar записывать наш бандл в папку app 
    // просто webpackDevMiddleware расчитан на работу с devServer и поэтому по-умолчанию не записывает файлы на диск
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
hmrServer.listen(3001, () => {
    console.log('Сервер HMR успешно запушен на порту 3001');
})

const compiler = webpack(webpackServerConfig)

// холодный старт
compiler.run((err) => {
    if (err) console.log('Ошибка компиляции: ', err)
    
    // в качестве первого аргумента передаются так называемые watch options
    // его оставляем пустым так как дефолтные настройки нас вполне устраивают
    compiler.watch({}, () => {
        if (err) console.log('Ошибка компиляции: ', err)
        console.log('Компиляция прошла успешно');
    })

    nodemon({
        // путь до скрипта который будет запускать nodemon и который будет выполнять сервер
        script: path.resolve(__dirname, '../app/server/server.js'),
        watch: [
            path.resolve(__dirname, '../app/server'),
            path.resolve(__dirname, '../app/client')
        ]
    })
})