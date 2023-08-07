import mongoose, { SortOrder } from 'mongoose'
import { IAward } from '../awardRecognition/awardRecognition.interface'
import { Award } from '../awardRecognition/awardRecognition.model'
import { ICareHome, ICareHomeFilters } from './careHome.interface'
import { CareHome } from './careHome.model'
import { Service } from '../careHomeService/careHomeService.model'
import { IService } from '../careHomeService/careHomeService.interface'
import { ICareTeam } from '../careHomeTeam/careHomeTeam.interface'
import { IFacilities } from '../facilities/facilities.interface'
import { Team } from '../careHomeTeam/careHomeTeam.model'
import { Facility } from '../facilities/facilities.model'
import { INewsEvent } from '../newsEvent/newsEvent.interface'
import { NewsEvent } from '../newsEvent/newsEvent.model'
import { IReviews } from '../reviews/reviews.interface'
import { Reviews } from '../reviews/review.model'
import {
  IGenericResponse,
  IPaginationOptions,
} from '../../../interfaces/pagination'
import { careHomeSearchableFields } from './careHome.constant'
import { paginationHelpers } from '../../../helpers/paginationHelpers'

const addCareHomeService = async (data: ICareHome) => {
  const result = await CareHome.create(data)
  return result
}

const getAllCareHomeService = async (
  paginationOptions: IPaginationOptions,
  filters: ICareHomeFilters,
): Promise<IGenericResponse<ICareHome[]>> => {
  const { searchTerm, ...filtersData } = filters

  const andConditions = []
  if (searchTerm) {
    andConditions.push({
      $or: careHomeSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    })
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    })
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {}

  const { page, skip, limit, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions)

  // sorting
  const sortConditions: { [key: string]: SortOrder } = {}

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder
  }

  const result = await CareHome.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
  const total = await CareHome.countDocuments()
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}
const getSingleCareHomeService = async (id: string) => {
  const result = await CareHome.findOne({ _id: id })
  if (!result) {
    throw Error('Care Home not found')
  }
  return result
}
const createAwardService = async (payload: IAward) => {
  const session = await mongoose.startSession()
  let result
  try {
    const home = await CareHome.findOne({ _id: payload.homeId })
    if (!home) {
      throw Error('Care Home Not Found')
    }
    home.awardRecognition = payload
    await home.save()
    result = await Award.create(payload)
    return result
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw error
  }
}
const createServices = async (payload: IService) => {
  const session = await mongoose.startSession()
  let result
  try {
    const home = await CareHome.findOne({ _id: payload.homeId })
    if (!home) {
      throw Error('Care Home Not Found')
    }
    home.careHomeService = payload
    await home.save()
    result = await Service.create(payload)
    return result
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw error
  }
}
const createTeamService = async (payload: ICareTeam) => {
  const session = await mongoose.startSession()
  let result
  try {
    const home = await CareHome.findOne({ _id: payload.homeId })
    if (!home) {
      throw Error('Care Home Not Found')
    }
    home.careHomeTeam = payload
    await home.save()
    result = await Team.create(payload)
    return result
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw error
  }
}
const createFacility = async (payload: IFacilities) => {
  const session = await mongoose.startSession()
  let result
  try {
    const home = await CareHome.findOne({ _id: payload.homeId })
    if (!home) {
      throw Error('Care Home Not Found')
    }
    home.facilities = payload
    await home.save()
    result = await Facility.create(payload)
    return result
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw error
  }
}
const createNewsEventService = async (payload: INewsEvent) => {
  const session = await mongoose.startSession()
  let result
  try {
    const home = await CareHome.findOne({ _id: payload.homeId })
    if (!home) {
      throw Error('Care Home Not Found')
    }
    home.newsEvent = payload
    await home.save()
    result = await NewsEvent.create(payload)
    return result
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw error
  }
}
const createReviewService = async (payload: IReviews) => {
  const session = await mongoose.startSession()
  let result
  try {
    const home = await CareHome.findOne({ _id: payload.homeId })
    if (!home) {
      throw Error('Care Home Not Found')
    }

    home.reviews?.push(payload)

    await home.save()

    result = await Reviews.create(payload)
    return result
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw error
  }
}

export const CareHomeService = {
  addCareHomeService,
  getAllCareHomeService,
  getSingleCareHomeService,
  createAwardService,
  createServices,
  createTeamService,
  createFacility,
  createNewsEventService,
  createReviewService,
}
