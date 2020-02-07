import { AbstractAPI } from './AbstractAPI'
import api from './instance'

const API_URL = process.env.API_CABINET_URL
export const studios = new AbstractAPI(`${API_URL}/settings/location`)

studios.servicesFacilities = async function () {
  try {
    const result = await api.get(`${API_URL}/settings/location/services-facilities`)
    return result.data
  } catch (err) {
    console.warn('catch :: room :: getBackgrounds', err)
    return err
  }
}
