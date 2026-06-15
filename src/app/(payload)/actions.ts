"use server"

import { handleServerFunctions as payloadHandleServerFunctions } from '@payloadcms/next/layouts'
import config from '../../payload.config'

export const handleServerFunctions = async (args: any) => payloadHandleServerFunctions({
  ...args,
  config,
})
