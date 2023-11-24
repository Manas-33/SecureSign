import express from 'express'
import upload from 'express-fileupload'
import * as IPFS from 'ipfs-core'
import * as fs from 'fs'

const app = express()
app.use(express.json())
app.use(upload())

const gateway = 'https://ipfs.io/ipfs/'
const ipfs = await IPFS.create()

app.post('/files', async (req, res) => {
    const buffer = req.files.file.data
    const result = await ipfs.add(buffer)
    console.log(result)
    res.send({ "path": result.path, "gateway": gateway })
})

app.get('/download/:hash', async (req, res) => {
    try {
        const hash = req.params.hash
        const stream = await ipfs.cat(hash)
        const chunks = []
        for await (const chunk of stream) {
            chunks.push(chunk)
        }
        const buffer = Buffer.concat(chunks)
        const filename = `${hash}.jpeg`
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`)
        res.write(buffer)
        res.end()
    } catch (err) {
        console.error(err)
        res.status(500).send('Error retrieving IPFS file')
    }
})