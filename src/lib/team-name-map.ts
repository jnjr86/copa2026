// Maps API-Football English team names → Portuguese names used in the DB
export const API_TO_DB_NAME: Record<string, string> = {
  // Americas
  "Brazil":                  "Brasil",
  "Argentina":               "Argentina",
  "Uruguay":                 "Uruguai",
  "Colombia":                "Colômbia",
  "Ecuador":                 "Equador",
  "Paraguay":                "Paraguai",
  "United States":           "Estados Unidos",
  "USA":                     "Estados Unidos",
  "Canada":                  "Canadá",
  "Mexico":                  "México",
  "Haiti":                   "Haiti",
  "Panama":                  "Panamá",
  "Curacao":                 "Curaçao",

  // Europe
  "Germany":                 "Alemanha",
  "France":                  "França",
  "Spain":                   "Espanha",
  "England":                 "Inglaterra",
  "Portugal":                "Portugal",
  "Netherlands":             "Países Baixos",
  "Belgium":                 "Bélgica",
  "Switzerland":             "Suíça",
  "Croatia":                 "Croácia",
  "Sweden":                  "Suécia",
  "Norway":                  "Noruega",
  "Austria":                 "Áustria",
  "Scotland":                "Escócia",
  "Turkey":                  "Turquia",
  "Czech Republic":          "República Tcheca",
  "Czechia":                 "República Tcheca",
  "Bosnia and Herzegovina":  "Bósnia e Herzegovina",
  "Bosnia":                  "Bósnia e Herzegovina",

  // Africa
  "Morocco":                 "Marrocos",
  "Senegal":                 "Senegal",
  "South Africa":            "África do Sul",
  "Ivory Coast":             "Costa do Marfim",
  "Côte d'Ivoire":           "Costa do Marfim",
  "Algeria":                 "Argélia",
  "Tunisia":                 "Tunísia",
  "Egypt":                   "Egito",
  "Ghana":                   "Gana",
  "Cape Verde":              "Cabo Verde",
  "DR Congo":                "RD Congo",
  "Congo DR":                "RD Congo",

  // Asia / Oceania
  "Japan":                   "Japão",
  "South Korea":             "Coreia do Sul",
  "Korea Republic":          "Coreia do Sul",
  "Australia":               "Austrália",
  "New Zealand":             "Nova Zelândia",
  "Saudi Arabia":            "Arábia Saudita",
  "Iran":                    "Irã",
  "Iraq":                    "Iraque",
  "Jordan":                  "Jordânia",
  "Uzbekistan":              "Uzbequistão",
  "Qatar":                   "Catar",
};

export function toDbName(apiName: string): string {
  return API_TO_DB_NAME[apiName] ?? apiName;
}
