export const config = {
  env: {
    secrets: {
      accessSecret: process.env.ACCESS_TOKEN_SECRET!,
      refreshSecret: process.env.REFRESH_TOKEN_SECRET!,
      authSecret: process.env.AUTH_TOKEN_SECRET!,
      emailHost: process.env.EMAIL_HOST!,
      emailUser: process.env.EMAIL_USER!,
      emailPass: process.env.EMAIL_PASSWORD!,
      bugReportEmail: process.env.REPORT_TO!,
      helpDeskEmail: process.env.HELP_DESK_EMAIL!,
      helpDeskPassword: process.env.HELP_DESK_EMAIL_PASSWORD!,
      helpDeskHost: process.env.HELP_DESK_HOST!,
      uploadThingSecret: process.env.UPLOADTHING_SECRET!,
      uploadThingAppId: process.env.UPLOADTHING_APP_ID!,
    },
    routes: {
      uploadCallback: process.env.UPLOADTHING_CALLBACK!,
    },
  },
  duration: {
    accessTokenExp: 5 * 1000,
    refreshTokenExp: 60 * 60 * 60 * 24 * 7 * 1000,
    authTokenExp: 60 * 60 * 2 * 1000,
  },
};
