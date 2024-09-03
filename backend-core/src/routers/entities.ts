var express = require('express')
var config = require('config')
var router = express.Router()

import { Request, Response, NextFunction } from 'express'
import { apiStatus, apiHandle } from '../core/tech/ApiHandlerUtils'
import ServicesService from '../services/ServicesService'
import SearchRequestData from '../core/models/SearchRequestData'
import Model from '../entities/Model'

const services = new ServicesService()

router.delete('/:entity/delete', function(req: Request, res: Response, next: NextFunction) {
  if (isNaN(parseInt(req.body.id, 10))) {
    apiStatus(res, 'Id terminal must be number', 500)
    return
  }
  const service = services.getService(req.params.entity)
  apiHandle(req, res, '', () => service.delete(parseInt(req.body.id, 10)), next)
})

router.delete('/:entity/deleteAll', function(req: Request, res: Response, next: NextFunction) {
  const idsArray: Array<number> = req.body
  const service = services.getService(req.params.entity)
  apiHandle(req, res, '', () => service.deleteAll(idsArray), next)
})

router.post('/:entity/create', function(req: Request, res: Response, next: NextFunction) {
  const service = services.getService(req.params.entity)
  const entity: Model = service.repo.model.fromObject(req.body)
  if (entity.hasLocal()) {
    entity.is_local = true
  }
  apiHandle(req, res, '', async () => {
    return await service.create(entity)
  }, next)
})

router.put('/:entity/update', function(req: Request, res: Response, next: NextFunction) {
  const service = services.getService(req.params.entity)
  const entity: Model = service.repo.model.fromObject(req.body)
  apiHandle(req, res, '', () => service.update(entity), next)
})

router.post('/:entity/createAll', function(req: Request, res: Response, next: NextFunction) {
  const service = services.getService(req.params.entity)
  const entities: Array<Model> = service.repo.model.fromArrayObject(req.body)
  entities.map(entity => {
    if (entity.hasLocal()) {
      entity.is_local = true
    }
    return entity
  })
  apiHandle(req, res, '', async () => {
    return await service.createAll(entities)
  }, next)
})

router.put('/:entity/updateAll', function(req: Request, res: Response, next: NextFunction) {
  const service = services.getService(req.params.entity)
  const entities: Array<Model> = service.repo.model.fromArrayObject(req.body)
  apiHandle(req, res, '', () => service.updateAll(entities), next)
})

router.get('/:entity/fetch', async function(req: Request, res: Response, next: NextFunction) {
  apiHandle(req, res, '', () => services.getService(req.params.entity).getSearchAll(new SearchRequestData().fromObject(req.query)), next)
})

router.get('/:entity/reindex', function(req: Request, res: Response, next: NextFunction) {
  apiHandle(req, res, '', async () => {
    return await services.getService(req.params.entity).reindex()
  }, next)
})

export default router
