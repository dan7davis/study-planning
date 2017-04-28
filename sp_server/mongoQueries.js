// FIND ALL EVENTS IN A COURSE
db.events.find(
    { id: "1234",
    course: "courseFC" }
)

// SUM OF ALL QUANT VARIABLES GROUPED BY LEARNER COURSE WEEK
db.events.aggregate(
   [
     {
       $group:
         {
           _id: { id: "$id", course: "$course", week: "$week" },
           totalSubmits: { $sum: "$uniqueSubmits" },
           totalVidDuration: { $sum: "$vidDuration" },
           totalVidWatched: { $sum: "$watched" },
           totalTimeSite: { $sum: "$timeSite" },
           totalEvents: { $sum: 1 }
         }
     }
   ]
)



// FIND THE MOST RECENT QUAL PLAN FOR EACH LEARNER per week
db.events.aggregate(
   [
     { $sort: { id: 1, time: 1 } },
     {
       $group:
         {
           _id: { id: "$id", course: "$course", week: "$week" },
           lastQualGoalSet: { $last: "$qualPlan" }
         }
     }
   ]
)

