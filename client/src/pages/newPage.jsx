// =IFERROR(
//     IF(
//         OR(Salt_Position="",Salt_Position="After Dyes"),
//         IF(
//             ISBLANK($J$3),
//             INDEX(INDIRECT("Titles_"&$B$23,TRUE),
//                   MATCH(5,INDIRECT("Position_"&$B$23&"_"&Scouring_System_Selected,TRUE),0)
//             ),
//             INDEX(INDIRECT("Titles_"&$B$23,TRUE),
//                   MATCH(7,INDIRECT("Position_"&$B$23&"_"&Scouring_System_Selected,TRUE),0)
//             )
//         ),
//         IF(
//             Scouring_System_Selected="CreamStripe",
//             IF(
//                 ISBLANK($J$3),
//                 INDEX(INDIRECT("Titles_"&$B$23,TRUE),
//                       MATCH(5,INDIRECT("Position_"&$B$23&"_"&Scouring_System_Selected,TRUE),0)
//                 ),
//                 INDEX(INDIRECT("Titles_"&$B$23,TRUE),
//                       MATCH(7,INDIRECT("Position_"&$B$23&"_"&Scouring_System_Selected,TRUE),0)
//                 )
//             ),
//             IF(
//                 ISBLANK(INDEX(Dyestuff_4,MATCH(Colour_Selected,Colour_Chart,0))),
//                 "",
//                 INDEX(Dyestuff_4,MATCH(Colour_Selected,Colour_Chart,0))
//             )
//         )
//     ),
//     "E"
// )






// =IFERROR(
//   IF(
//     OR(Salt_Position="", Salt_Position="After Dyes"),
//     INDEX(
//       INDIRECT("Ingredients_" & $B$23, TRUE),
//       MATCH(Colour_Selected, Colour_Chart, 0),
//       MATCH(B34, INDIRECT("Titles_" & $B$23, TRUE), 0)
//     ),
//     IF(
//       Scouring_System_Selected="CreamStripe",
//       INDEX(
//         INDIRECT("Ingredients_" & $B$23, TRUE),
//         MATCH(Colour_Selected, Colour_Chart, 0),
//         MATCH(B34, INDIRECT("Titles_" & $B$23, TRUE), 0)
//       ),
//       IF(
//         ISBLANK(
//           INDEX(Dyestuff_4_Amt, MATCH(Colour_Selected, Colour_Chart, 0))
//         ),
//         "",
//         INDEX(Dyestuff_4_Amt, MATCH(Colour_Selected, Colour_Chart, 0))
//       )
//     )
//   ),
//   ""
// )




// =IFERROR(
//   IF(
//     OR(Salt_Position="", Salt_Position="After Dyes"),
//     IF(
//       C34 * Water_Litres_Dyeing >= 1000,
//       ROUNDUP(C34 * Water_Litres_Dyeing / 1000, 0) & Standards!$D$174,
//       ROUNDUP(C34 * Water_Litres_Dyeing, 0)
//     ),
//     IF(
//       Scouring_System_Selected = "CreamStripe",
//       IF(
//         C34 * Water_Litres_Dyeing >= 1000,
//         ROUND(C34 * Water_Litres_Dyeing / 1000, 1) & Standards!$D$174,
//         ROUND(C34 * Water_Litres_Dyeing, 1)
//       ),
//       IF(
//         $C$34 * Quantity_Kgs_Dyeing >= 1.1,
//         TRUNC($C$34 * Quantity_Kgs_Dyeing, 0) & Standards!$D$174 & ROUND((TRUNC($C$34 * Quantity_Kgs_Dyeing, 3) 
// * 1000 - (TRUNC($C$34 * Quantity_Kgs_Dyeing, 0) * 1000)), 0) & Standards!$D$175,
//         IF(
//           ROUND($C$34 * Quantity_Kgs_Dyeing, 3) * 1000 = 0,
//           "",
//           ROUND($C$34 * Quantity_Kgs_Dyeing, 3) * 1000 & Standards!$D$175
//         )
//       )
//     )
//   ),
//   ""
// )




// =IFERROR(
//     IF(
//         Scouring_System_Selected="CreamStripe",
//         "40˚C",
//         INDEX(
//             INDIRECT("Ingredients_" & $B$23, TRUE),
//             MATCH(Colour_Selected, Colour_Chart, 0),
//             MATCH(20, INDIRECT("Position_" & $B$23 & "_" & Dyeing_System_Selected, TRUE), 0)
//         )
//     ),
//     ""
// )







// IFERROR(
//     IF(
//         OR(Salt_Position="", Salt_Position="After Dyes"),
//         "REMAIN IN DWELL FOR 20 MINS",
//         IF(
//             Scouring_System_Selected="CreamStripe",
//             "WAIT FOR 20 MINS",
//             IF(
//                 ISBLANK(INDEX(Dyestuff_4, MATCH(Colour_Selected, Colour_Chart, 0))),
//                 "",
//                 INDEX(Dyestuff_4, MATCH(Colour_Selected, Colour_Chart, 0))
//             )
//         )
//     ),
