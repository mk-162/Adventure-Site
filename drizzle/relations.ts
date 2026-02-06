import { relations } from "drizzle-orm/relations";
import { sites, adCampaigns, advertisers, itineraries, regions, itineraryItems, activities, accommodation, locations, pageAds, pageSponsors, operators, operatorOffers, adSlots, answers, accommodationTags, tags, transport, serviceSlots, activityTypes, adCreatives, contentRules, adminUsers, statusHistory, activityRegions, posts, postTags, itineraryTags, bulkOperations, activityTags, locationTags, users, userFavourites, operatorSessions, magicLinks, operatorClaims, events, eventSaves, comments, commentVotes, itineraryStops, guidePages, outreachCampaigns, outreachRecipients, pageViews, guidePageSpots, advertiserAccounts } from "./schema";

export const adCampaignsRelations = relations(adCampaigns, ({one, many}) => ({
	site: one(sites, {
		fields: [adCampaigns.siteId],
		references: [sites.id]
	}),
	advertiser: one(advertisers, {
		fields: [adCampaigns.advertiserId],
		references: [advertisers.id]
	}),
	adCreatives: many(adCreatives),
}));

export const sitesRelations = relations(sites, ({many}) => ({
	adCampaigns: many(adCampaigns),
	itineraries: many(itineraries),
	pageAds: many(pageAds),
	pageSponsors: many(pageSponsors),
	locations: many(locations),
	adSlots: many(adSlots),
	answers: many(answers),
	transports: many(transport),
	regions: many(regions),
	serviceSlots: many(serviceSlots),
	activityTypes: many(activityTypes),
	advertisers: many(advertisers),
	contentRules: many(contentRules),
	tags: many(tags),
	bulkOperations: many(bulkOperations),
	accommodations: many(accommodation),
	activities: many(activities),
	posts: many(posts),
	guidePages: many(guidePages),
	pageViews: many(pageViews),
	outreachCampaigns: many(outreachCampaigns),
	events: many(events),
	operators: many(operators),
}));

export const advertisersRelations = relations(advertisers, ({one, many}) => ({
	adCampaigns: many(adCampaigns),
	site: one(sites, {
		fields: [advertisers.siteId],
		references: [sites.id]
	}),
}));

export const itinerariesRelations = relations(itineraries, ({one, many}) => ({
	site: one(sites, {
		fields: [itineraries.siteId],
		references: [sites.id]
	}),
	region: one(regions, {
		fields: [itineraries.regionId],
		references: [regions.id]
	}),
	itineraryItems: many(itineraryItems),
	itineraryTags: many(itineraryTags),
	itineraryStops: many(itineraryStops),
}));

export const regionsRelations = relations(regions, ({one, many}) => ({
	itineraries: many(itineraries),
	locations: many(locations),
	answers: many(answers),
	transports: many(transport),
	site: one(sites, {
		fields: [regions.siteId],
		references: [sites.id]
	}),
	activityRegions: many(activityRegions),
	accommodations: many(accommodation),
	activities: many(activities),
	posts: many(posts),
	guidePages: many(guidePages),
	events: many(events),
}));

export const itineraryItemsRelations = relations(itineraryItems, ({one}) => ({
	itinerary: one(itineraries, {
		fields: [itineraryItems.itineraryId],
		references: [itineraries.id]
	}),
	activity: one(activities, {
		fields: [itineraryItems.activityId],
		references: [activities.id]
	}),
	accommodation: one(accommodation, {
		fields: [itineraryItems.accommodationId],
		references: [accommodation.id]
	}),
	location: one(locations, {
		fields: [itineraryItems.locationId],
		references: [locations.id]
	}),
}));

export const activitiesRelations = relations(activities, ({one, many}) => ({
	itineraryItems: many(itineraryItems),
	activityRegions: many(activityRegions),
	activityTags: many(activityTags),
	site: one(sites, {
		fields: [activities.siteId],
		references: [sites.id]
	}),
	region: one(regions, {
		fields: [activities.regionId],
		references: [regions.id]
	}),
	operator: one(operators, {
		fields: [activities.operatorId],
		references: [operators.id]
	}),
	activityType: one(activityTypes, {
		fields: [activities.activityTypeId],
		references: [activityTypes.id]
	}),
	itineraryStops_activityId: many(itineraryStops, {
		relationName: "itineraryStops_activityId_activities_id"
	}),
	itineraryStops_wetAltActivityId: many(itineraryStops, {
		relationName: "itineraryStops_wetAltActivityId_activities_id"
	}),
	itineraryStops_budgetAltActivityId: many(itineraryStops, {
		relationName: "itineraryStops_budgetAltActivityId_activities_id"
	}),
	guidePageSpots: many(guidePageSpots),
}));

export const accommodationRelations = relations(accommodation, ({one, many}) => ({
	itineraryItems: many(itineraryItems),
	accommodationTags: many(accommodationTags),
	site: one(sites, {
		fields: [accommodation.siteId],
		references: [sites.id]
	}),
	region: one(regions, {
		fields: [accommodation.regionId],
		references: [regions.id]
	}),
	itineraryStops: many(itineraryStops),
}));

export const locationsRelations = relations(locations, ({one, many}) => ({
	itineraryItems: many(itineraryItems),
	site: one(sites, {
		fields: [locations.siteId],
		references: [sites.id]
	}),
	region: one(regions, {
		fields: [locations.regionId],
		references: [regions.id]
	}),
	locationTags: many(locationTags),
	itineraryStops: many(itineraryStops),
}));

export const pageAdsRelations = relations(pageAds, ({one}) => ({
	site: one(sites, {
		fields: [pageAds.siteId],
		references: [sites.id]
	}),
}));

export const pageSponsorsRelations = relations(pageSponsors, ({one}) => ({
	site: one(sites, {
		fields: [pageSponsors.siteId],
		references: [sites.id]
	}),
	operator: one(operators, {
		fields: [pageSponsors.operatorId],
		references: [operators.id]
	}),
}));

export const operatorsRelations = relations(operators, ({one, many}) => ({
	pageSponsors: many(pageSponsors),
	operatorOffers: many(operatorOffers),
	serviceSlots: many(serviceSlots),
	activities: many(activities),
	operatorSessions: many(operatorSessions),
	magicLinks: many(magicLinks),
	operatorClaims: many(operatorClaims),
	itineraryStops: many(itineraryStops),
	guidePages: many(guidePages),
	outreachRecipients: many(outreachRecipients),
	pageViews: many(pageViews),
	guidePageSpots: many(guidePageSpots),
	events: many(events),
	site: one(sites, {
		fields: [operators.siteId],
		references: [sites.id]
	}),
	advertiserAccount: one(advertiserAccounts, {
		fields: [operators.accountId],
		references: [advertiserAccounts.id]
	}),
}));

export const operatorOffersRelations = relations(operatorOffers, ({one}) => ({
	operator: one(operators, {
		fields: [operatorOffers.operatorId],
		references: [operators.id]
	}),
}));

export const adSlotsRelations = relations(adSlots, ({one}) => ({
	site: one(sites, {
		fields: [adSlots.siteId],
		references: [sites.id]
	}),
}));

export const answersRelations = relations(answers, ({one}) => ({
	site: one(sites, {
		fields: [answers.siteId],
		references: [sites.id]
	}),
	region: one(regions, {
		fields: [answers.regionId],
		references: [regions.id]
	}),
}));

export const accommodationTagsRelations = relations(accommodationTags, ({one}) => ({
	accommodation: one(accommodation, {
		fields: [accommodationTags.accommodationId],
		references: [accommodation.id]
	}),
	tag: one(tags, {
		fields: [accommodationTags.tagId],
		references: [tags.id]
	}),
}));

export const tagsRelations = relations(tags, ({one, many}) => ({
	accommodationTags: many(accommodationTags),
	site: one(sites, {
		fields: [tags.siteId],
		references: [sites.id]
	}),
	postTags: many(postTags),
	itineraryTags: many(itineraryTags),
	activityTags: many(activityTags),
	locationTags: many(locationTags),
}));

export const transportRelations = relations(transport, ({one}) => ({
	site: one(sites, {
		fields: [transport.siteId],
		references: [sites.id]
	}),
	region: one(regions, {
		fields: [transport.regionId],
		references: [regions.id]
	}),
}));

export const serviceSlotsRelations = relations(serviceSlots, ({one}) => ({
	site: one(sites, {
		fields: [serviceSlots.siteId],
		references: [sites.id]
	}),
	operator: one(operators, {
		fields: [serviceSlots.operatorId],
		references: [operators.id]
	}),
}));

export const activityTypesRelations = relations(activityTypes, ({one, many}) => ({
	site: one(sites, {
		fields: [activityTypes.siteId],
		references: [sites.id]
	}),
	activities: many(activities),
	posts: many(posts),
	guidePages: many(guidePages),
}));

export const adCreativesRelations = relations(adCreatives, ({one}) => ({
	adCampaign: one(adCampaigns, {
		fields: [adCreatives.campaignId],
		references: [adCampaigns.id]
	}),
}));

export const contentRulesRelations = relations(contentRules, ({one}) => ({
	site: one(sites, {
		fields: [contentRules.siteId],
		references: [sites.id]
	}),
}));

export const statusHistoryRelations = relations(statusHistory, ({one}) => ({
	adminUser: one(adminUsers, {
		fields: [statusHistory.changedBy],
		references: [adminUsers.id]
	}),
}));

export const adminUsersRelations = relations(adminUsers, ({many}) => ({
	statusHistories: many(statusHistory),
	bulkOperations: many(bulkOperations),
}));

export const activityRegionsRelations = relations(activityRegions, ({one}) => ({
	activity: one(activities, {
		fields: [activityRegions.activityId],
		references: [activities.id]
	}),
	region: one(regions, {
		fields: [activityRegions.regionId],
		references: [regions.id]
	}),
}));

export const postTagsRelations = relations(postTags, ({one}) => ({
	post: one(posts, {
		fields: [postTags.postId],
		references: [posts.id]
	}),
	tag: one(tags, {
		fields: [postTags.tagId],
		references: [tags.id]
	}),
}));

export const postsRelations = relations(posts, ({one, many}) => ({
	postTags: many(postTags),
	site: one(sites, {
		fields: [posts.siteId],
		references: [sites.id]
	}),
	region: one(regions, {
		fields: [posts.regionId],
		references: [regions.id]
	}),
	activityType: one(activityTypes, {
		fields: [posts.activityTypeId],
		references: [activityTypes.id]
	}),
}));

export const itineraryTagsRelations = relations(itineraryTags, ({one}) => ({
	itinerary: one(itineraries, {
		fields: [itineraryTags.itineraryId],
		references: [itineraries.id]
	}),
	tag: one(tags, {
		fields: [itineraryTags.tagId],
		references: [tags.id]
	}),
}));

export const bulkOperationsRelations = relations(bulkOperations, ({one}) => ({
	site: one(sites, {
		fields: [bulkOperations.siteId],
		references: [sites.id]
	}),
	adminUser: one(adminUsers, {
		fields: [bulkOperations.adminUserId],
		references: [adminUsers.id]
	}),
}));

export const activityTagsRelations = relations(activityTags, ({one}) => ({
	activity: one(activities, {
		fields: [activityTags.activityId],
		references: [activities.id]
	}),
	tag: one(tags, {
		fields: [activityTags.tagId],
		references: [tags.id]
	}),
}));

export const locationTagsRelations = relations(locationTags, ({one}) => ({
	location: one(locations, {
		fields: [locationTags.locationId],
		references: [locations.id]
	}),
	tag: one(tags, {
		fields: [locationTags.tagId],
		references: [tags.id]
	}),
}));

export const userFavouritesRelations = relations(userFavourites, ({one}) => ({
	user: one(users, {
		fields: [userFavourites.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	userFavourites: many(userFavourites),
	comments: many(comments),
}));

export const operatorSessionsRelations = relations(operatorSessions, ({one}) => ({
	operator: one(operators, {
		fields: [operatorSessions.operatorId],
		references: [operators.id]
	}),
}));

export const magicLinksRelations = relations(magicLinks, ({one}) => ({
	operator: one(operators, {
		fields: [magicLinks.operatorId],
		references: [operators.id]
	}),
}));

export const operatorClaimsRelations = relations(operatorClaims, ({one}) => ({
	operator: one(operators, {
		fields: [operatorClaims.operatorId],
		references: [operators.id]
	}),
}));

export const eventSavesRelations = relations(eventSaves, ({one}) => ({
	event: one(events, {
		fields: [eventSaves.eventId],
		references: [events.id]
	}),
}));

export const eventsRelations = relations(events, ({one, many}) => ({
	eventSaves: many(eventSaves),
	site: one(sites, {
		fields: [events.siteId],
		references: [sites.id]
	}),
	region: one(regions, {
		fields: [events.regionId],
		references: [regions.id]
	}),
	operator: one(operators, {
		fields: [events.operatorId],
		references: [operators.id]
	}),
}));

export const commentVotesRelations = relations(commentVotes, ({one}) => ({
	comment: one(comments, {
		fields: [commentVotes.commentId],
		references: [comments.id]
	}),
}));

export const commentsRelations = relations(comments, ({one, many}) => ({
	commentVotes: many(commentVotes),
	user: one(users, {
		fields: [comments.userId],
		references: [users.id]
	}),
}));

export const itineraryStopsRelations = relations(itineraryStops, ({one}) => ({
	itinerary: one(itineraries, {
		fields: [itineraryStops.itineraryId],
		references: [itineraries.id]
	}),
	activity_activityId: one(activities, {
		fields: [itineraryStops.activityId],
		references: [activities.id],
		relationName: "itineraryStops_activityId_activities_id"
	}),
	accommodation: one(accommodation, {
		fields: [itineraryStops.accommodationId],
		references: [accommodation.id]
	}),
	location: one(locations, {
		fields: [itineraryStops.locationId],
		references: [locations.id]
	}),
	operator: one(operators, {
		fields: [itineraryStops.operatorId],
		references: [operators.id]
	}),
	activity_wetAltActivityId: one(activities, {
		fields: [itineraryStops.wetAltActivityId],
		references: [activities.id],
		relationName: "itineraryStops_wetAltActivityId_activities_id"
	}),
	activity_budgetAltActivityId: one(activities, {
		fields: [itineraryStops.budgetAltActivityId],
		references: [activities.id],
		relationName: "itineraryStops_budgetAltActivityId_activities_id"
	}),
}));

export const guidePagesRelations = relations(guidePages, ({one, many}) => ({
	site: one(sites, {
		fields: [guidePages.siteId],
		references: [sites.id]
	}),
	region: one(regions, {
		fields: [guidePages.regionId],
		references: [regions.id]
	}),
	activityType: one(activityTypes, {
		fields: [guidePages.activityTypeId],
		references: [activityTypes.id]
	}),
	operator: one(operators, {
		fields: [guidePages.sponsorOperatorId],
		references: [operators.id]
	}),
	guidePageSpots: many(guidePageSpots),
}));

export const outreachRecipientsRelations = relations(outreachRecipients, ({one}) => ({
	outreachCampaign: one(outreachCampaigns, {
		fields: [outreachRecipients.campaignId],
		references: [outreachCampaigns.id]
	}),
	operator: one(operators, {
		fields: [outreachRecipients.operatorId],
		references: [operators.id]
	}),
}));

export const outreachCampaignsRelations = relations(outreachCampaigns, ({one, many}) => ({
	outreachRecipients: many(outreachRecipients),
	site: one(sites, {
		fields: [outreachCampaigns.siteId],
		references: [sites.id]
	}),
}));

export const pageViewsRelations = relations(pageViews, ({one}) => ({
	site: one(sites, {
		fields: [pageViews.siteId],
		references: [sites.id]
	}),
	operator: one(operators, {
		fields: [pageViews.operatorId],
		references: [operators.id]
	}),
}));

export const guidePageSpotsRelations = relations(guidePageSpots, ({one}) => ({
	guidePage: one(guidePages, {
		fields: [guidePageSpots.guidePageId],
		references: [guidePages.id]
	}),
	operator: one(operators, {
		fields: [guidePageSpots.operatorId],
		references: [operators.id]
	}),
	activity: one(activities, {
		fields: [guidePageSpots.activityId],
		references: [activities.id]
	}),
}));

export const advertiserAccountsRelations = relations(advertiserAccounts, ({many}) => ({
	operators: many(operators),
}));