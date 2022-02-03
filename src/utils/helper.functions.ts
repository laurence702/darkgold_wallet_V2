import PrismaService from '@services/prisma';

// export const getSectionType = (sectionType: string): SECTION_TYPE => {
//   if (sectionType.toUpperCase() === SECTION_TYPE.SECTION_WITH_BACKGROUND_IMAGE) {
//     return SECTION_TYPE.SECTION_WITH_BACKGROUND_IMAGE
//   }
//   if (sectionType.toUpperCase() === SECTION_TYPE.SECTION_WITH_BLACK_BACKGROUND) {
//     return SECTION_TYPE.SECTION_WITH_BLACK_BACKGROUND
//   }
//   if (sectionType.toUpperCase() === SECTION_TYPE.SECTION_WITH_NO_BACKGROUND) {
//     return SECTION_TYPE.SECTION_WITH_NO_BACKGROUND
//   }
//   if (sectionType.toUpperCase() === SECTION_TYPE.SECTION_WITH_WHITE_BACKGROUND) {
//     return SECTION_TYPE.SECTION_WITH_WHITE_BACKGROUND
//   }
// };

// export const getPageTEmplate = (sectionType: string): PAGE_TEMPLATE => {
//   if (sectionType.toUpperCase() === PAGE_TEMPLATE.COMMITMENT) {
//     return PAGE_TEMPLATE.COMMITMENT
//   }
//   if (sectionType.toUpperCase() === PAGE_TEMPLATE.CORPERATE_SOCIAL_RESPONSIBILITY) {
//     return PAGE_TEMPLATE.CORPERATE_SOCIAL_RESPONSIBILITY
//   }
//   if (sectionType.toUpperCase() === PAGE_TEMPLATE.LANDING_PAGE) {
//     return PAGE_TEMPLATE.LANDING_PAGE
//   }
//   if (sectionType.toUpperCase() === PAGE_TEMPLATE.PARTNERS_AND_AFFILIATION) {
//     return PAGE_TEMPLATE.PARTNERS_AND_AFFILIATION
//   }
//   if (sectionType.toUpperCase() === PAGE_TEMPLATE.PEOPLE_AND_LEADERSHIP) {
//     return PAGE_TEMPLATE.PEOPLE_AND_LEADERSHIP
//   }
// };

export const getCurrentFormartedDate = (): string => {
  const dateData: Date = new Date();
  const year = dateData.getFullYear();
  const month = dateData.getMonth();
  const day = dateData.getDate();
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const formattedDate = `${months[month]} ${day}, ${year}`;
  return formattedDate;
};

export const deleteFlagedPages = async (): Promise<number> => {
  try {
    const deleteDate = new Date().getTime();
    const prisma = new PrismaService();
    // const deleteCount = await prisma.page.deleteMany({
    //   where: {
    //     status: PAGE_STATUS.DELETED,
    //     deleteDate: {
    //       lte: deleteDate,
    //     },
    //   },
    // });
    // return deleteCount.count;
  } catch (error) {
    console.log(error);
    return 0;
  }
};

export const setDeleteDate = (): number => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 30);
  return futureDate.getTime();
};

export const getPath = (): string => {
  const end = __dirname.indexOf('/src');
  const path = __dirname.substring(0, end);
  return `${path}/modules/mail/templates`;
};
