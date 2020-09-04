const db = require('../../../lib/db')
const escape = require('sql-template-strings')

export default async (req, res) => {
    if(req.method === 'GET'){
        let lang = req.query.lang || 'en'
        const category = parseInt(req.query.category) || 0
        const sortBy = parseInt(req.query.sortBy) || 0
        const searchBy = req.query.searchBy || ''
        const period = req.query.period || ''
        const searchTarget = req.query.searchTarget
        let page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 9
    
        if (page < 1) page = 1

        const query = escape`
            SELECT *
            FROM bingos
            WHERE lang = ${lang} 
        `
        if(category !== 0){
            query.append(escape` AND categoryId = ${category}`)
        }

        if(searchBy !== ''){
            if(searchTarget === 'title'){
                query.append(escape` AND title LIKE `)
            } else if(searchTarget === 'elements'){
                query.append(escape` AND elements LIKE `)
            } else if(searchTarget === 'author'){
                query.append(escape` AND author LIKE `)
            }
            let chunk = '%'
            if(typeof searchBy === 'string'){
                chunk += searchBy + '%'
            } else {
                searchBy.map(v => {
                    chunk += v + '%'
                })
            }
            query.append(escape`${chunk}`)
        }

        if(period === 'month'){
            query.append(escape` AND createdAt >= ( CURDATE() - INTERVAL 30 DAY )`)
        } else if(period === 'week'){
            query.append(escape` AND createdAt >= ( CURDATE() - INTERVAL 1 DAY )`)
        } else if(period === 'today'){
            query.append(escape` AND createdAt >= NOW()`)
        }

        if(sortBy === 0){
            query.append(` ORDER BY likes DESC`)
        } else if(sortBy === 1){
            query.append(` ORDER BY createdAt DESC`)
        }

        query.append(escape` LIMIT ${(page - 1) * limit}, ${limit}`)

        const bingos = await db.query(query)

        res.status(200).json({ bingos })

    } else if(req.method === 'POST'){
        const lang = req.query.lang || 'en'
        const lock = req.body.lock
        const author = req.body.author
        const password = req.body.password
        const category = req.body.category
        const title = req.body.title
        const size = req.body.size
        const elements = req.body.elements
        const bgMainColor = req.body.bgMainColor
        const bgSubColor = req.body.bgSubColor
        const fontColor = req.body.fontColor
        const cellColor = req.body.cellColor
        const lineColor = req.body.lineColor
        const linePixel = req.body.linePixel
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress

        // console.log(lock + ' ' + password+ ' ' + title+ ' ' + author+ ' ' + size+ ' ' + elements+ ' ' + bgMainColor+ ' ' + bgSubColor+ ' ' + fontColor+ ' ' + cellColor+ ' ' + lineColor+ ' ' + linePixel)
        console.log(elements)
        // console.log(req.headers['x-real-ip'] || req.connection.remoteAddress)

        const insertResult = await db.query(escape`
            INSERT INTO bingos (lang, categoryId, title, author, size, elements, bgMainColor, bgSubColor, fontColor, cellColor, lineColor, linePixel, ipAddress)
            VALUES (${lang}, ${category}, ${title}, ${author}, ${size}, ${JSON.stringify(elements)}, ${bgMainColor}, ${bgSubColor}, ${fontColor}, ${cellColor}, ${lineColor}, ${linePixel}, ${ipAddress});
        `)

        res.status(200).json({ insertResult })
    }
}