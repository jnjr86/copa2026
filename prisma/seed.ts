import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.match.deleteMany();
  await prisma.team.deleteMany();
  await prisma.stadium.deleteMany();

  // STADIUMS
  const stadiumData = [
    { name: "Estadio Azteca", city: "Cidade do México", country: "México", capacity: 87523 },
    { name: "Estadio Akron (Guadalajara)", city: "Guadalajara", country: "México", capacity: 49850 },
    { name: "Estadio BBVA (Monterrey)", city: "Monterrey", country: "México", capacity: 53500 },
    { name: "MetLife Stadium", city: "Nova Jersey", country: "EUA", capacity: 82500 },
    { name: "SoFi Stadium", city: "Los Angeles", country: "EUA", capacity: 70240 },
    { name: "Rose Bowl Stadium", city: "Los Angeles", country: "EUA", capacity: 88565 },
    { name: "AT&T Stadium", city: "Dallas", country: "EUA", capacity: 80000 },
    { name: "Levi's Stadium", city: "San Francisco", country: "EUA", capacity: 68500 },
    { name: "Lincoln Financial Field", city: "Filadélfia", country: "EUA", capacity: 69796 },
    { name: "Gillette Stadium", city: "Boston", country: "EUA", capacity: 65878 },
    { name: "Hard Rock Stadium", city: "Miami", country: "EUA", capacity: 65326 },
    { name: "Mercedes-Benz Stadium", city: "Atlanta", country: "EUA", capacity: 71000 },
    { name: "Lumen Field", city: "Seattle", country: "EUA", capacity: 68740 },
    { name: "Arrowhead Stadium", city: "Kansas City", country: "EUA", capacity: 76416 },
    { name: "BMO Field", city: "Toronto", country: "Canadá", capacity: 45736 },
    { name: "BC Place", city: "Vancouver", country: "Canadá", capacity: 54500 },
  ];

  for (const s of stadiumData) {
    await prisma.stadium.create({ data: s });
  }

  const stadiums = await prisma.stadium.findMany();
  const stadiumMap = new Map(stadiums.map((s) => [s.name, s.id]));

  // TEAMS
  const teamData = [
    { name: "México", flag: "🇲🇽", group: "A", confederation: "CONCACAF" },
    { name: "África do Sul", flag: "🇿🇦", group: "A", confederation: "CAF" },
    { name: "Coreia do Sul", flag: "🇰🇷", group: "A", confederation: "AFC" },
    { name: "República Tcheca", flag: "🇨🇿", group: "A", confederation: "UEFA" },
    { name: "Suíça", flag: "🇨🇭", group: "B", confederation: "UEFA" },
    { name: "Bósnia e Herzegovina", flag: "🇧🇦", group: "B", confederation: "UEFA" },
    { name: "Canadá", flag: "🇨🇦", group: "B", confederation: "CONCACAF" },
    { name: "Catar", flag: "🇶🇦", group: "B", confederation: "AFC" },
    { name: "Brasil", flag: "🇧🇷", group: "C", confederation: "CONMEBOL" },
    { name: "Marrocos", flag: "🇲🇦", group: "C", confederation: "CAF" },
    { name: "Escócia", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", group: "C", confederation: "UEFA" },
    { name: "Haiti", flag: "🇭🇹", group: "C", confederation: "CONCACAF" },
    { name: "Estados Unidos", flag: "🇺🇸", group: "D", confederation: "CONCACAF" },
    { name: "Austrália", flag: "🇦🇺", group: "D", confederation: "AFC" },
    { name: "Turquia", flag: "🇹🇷", group: "D", confederation: "UEFA" },
    { name: "Paraguai", flag: "🇵🇾", group: "D", confederation: "CONMEBOL" },
    { name: "Alemanha", flag: "🇩🇪", group: "E", confederation: "UEFA" },
    { name: "Costa do Marfim", flag: "🇨🇮", group: "E", confederation: "CAF" },
    { name: "Equador", flag: "🇪🇨", group: "E", confederation: "CONMEBOL" },
    { name: "Curaçao", flag: "🇨🇼", group: "E", confederation: "CONCACAF" },
    { name: "Países Baixos", flag: "🇳🇱", group: "F", confederation: "UEFA" },
    { name: "Japão", flag: "🇯🇵", group: "F", confederation: "AFC" },
    { name: "Suécia", flag: "🇸🇪", group: "F", confederation: "UEFA" },
    { name: "Tunísia", flag: "🇹🇳", group: "F", confederation: "CAF" },
    { name: "Bélgica", flag: "🇧🇪", group: "G", confederation: "UEFA" },
    { name: "Irã", flag: "🇮🇷", group: "G", confederation: "AFC" },
    { name: "Nova Zelândia", flag: "🇳🇿", group: "G", confederation: "OFC" },
    { name: "Egito", flag: "🇪🇬", group: "G", confederation: "CAF" },
    { name: "Espanha", flag: "🇪🇸", group: "H", confederation: "UEFA" },
    { name: "Arábia Saudita", flag: "🇸🇦", group: "H", confederation: "AFC" },
    { name: "Uruguai", flag: "🇺🇾", group: "H", confederation: "CONMEBOL" },
    { name: "Cabo Verde", flag: "🇨🇻", group: "H", confederation: "CAF" },
    { name: "França", flag: "🇫🇷", group: "I", confederation: "UEFA" },
    { name: "Senegal", flag: "🇸🇳", group: "I", confederation: "CAF" },
    { name: "Noruega", flag: "🇳🇴", group: "I", confederation: "UEFA" },
    { name: "Iraque", flag: "🇮🇶", group: "I", confederation: "AFC" },
    { name: "Argentina", flag: "🇦🇷", group: "J", confederation: "CONMEBOL" },
    { name: "Áustria", flag: "🇦🇹", group: "J", confederation: "UEFA" },
    { name: "Argélia", flag: "🇩🇿", group: "J", confederation: "CAF" },
    { name: "Jordânia", flag: "🇯🇴", group: "J", confederation: "AFC" },
    { name: "Portugal", flag: "🇵🇹", group: "K", confederation: "UEFA" },
    { name: "RD Congo", flag: "🇨🇩", group: "K", confederation: "CAF" },
    { name: "Uzbequistão", flag: "🇺🇿", group: "K", confederation: "AFC" },
    { name: "Colômbia", flag: "🇨🇴", group: "K", confederation: "CONMEBOL" },
    { name: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", group: "L", confederation: "UEFA" },
    { name: "Croácia", flag: "🇭🇷", group: "L", confederation: "UEFA" },
    { name: "Gana", flag: "🇬🇭", group: "L", confederation: "CAF" },
    { name: "Panamá", flag: "🇵🇦", group: "L", confederation: "CONCACAF" },
  ];

  for (const t of teamData) {
    await prisma.team.create({ data: t });
  }

  const teams = await prisma.team.findMany();
  const teamMap = new Map(teams.map((t) => [t.name, t.id]));

  type GroupMatchRow = [number, string, string, string, string, string, string];
  type KnockoutMatchRow = [number, string, null, string, null, null, string, string, string];

  const groupMatches: GroupMatchRow[] = [
    [1,  "Grupo", "A", "2026-06-11T19:00:00.000Z", "México", "África do Sul", "Estadio Azteca"],
    [2,  "Grupo", "A", "2026-06-12T02:00:00.000Z", "Coreia do Sul", "República Tcheca", "Estadio Akron (Guadalajara)"],
    [3,  "Grupo", "B", "2026-06-12T19:00:00.000Z", "Canadá", "Bósnia e Herzegovina", "BMO Field"],
    [4,  "Grupo", "D", "2026-06-13T01:00:00.000Z", "Estados Unidos", "Paraguai", "SoFi Stadium"],
    [5,  "Grupo", "C", "2026-06-13T19:00:00.000Z", "Brasil", "Marrocos", "MetLife Stadium"],
    [6,  "Grupo", "B", "2026-06-13T19:00:00.000Z", "Suíça", "Catar", "Levi's Stadium"],
    [7,  "Grupo", "C", "2026-06-14T01:00:00.000Z", "Escócia", "Haiti", "Gillette Stadium"],
    [8,  "Grupo", "D", "2026-06-14T04:00:00.000Z", "Austrália", "Turquia", "BC Place"],
    [9,  "Grupo", "E", "2026-06-14T17:00:00.000Z", "Alemanha", "Curaçao", "Arrowhead Stadium"],
    [10, "Grupo", "F", "2026-06-14T20:00:00.000Z", "Países Baixos", "Japão", "AT&T Stadium"],
    [11, "Grupo", "E", "2026-06-14T23:00:00.000Z", "Equador", "Costa do Marfim", "Lincoln Financial Field"],
    [12, "Grupo", "F", "2026-06-15T02:00:00.000Z", "Tunísia", "Suécia", "Estadio BBVA (Monterrey)"],
    [13, "Grupo", "H", "2026-06-15T16:00:00.000Z", "Espanha", "Cabo Verde", "Mercedes-Benz Stadium"],
    [14, "Grupo", "G", "2026-06-15T19:00:00.000Z", "Bélgica", "Egito", "Lumen Field"],
    [15, "Grupo", "H", "2026-06-15T22:00:00.000Z", "Uruguai", "Arábia Saudita", "Hard Rock Stadium"],
    [16, "Grupo", "G", "2026-06-16T01:00:00.000Z", "Irã", "Nova Zelândia", "SoFi Stadium"],
    [17, "Grupo", "I", "2026-06-16T19:00:00.000Z", "França", "Senegal", "MetLife Stadium"],
    [18, "Grupo", "I", "2026-06-16T22:00:00.000Z", "Noruega", "Iraque", "Gillette Stadium"],
    [19, "Grupo", "J", "2026-06-17T01:00:00.000Z", "Argentina", "Argélia", "Arrowhead Stadium"],
    [20, "Grupo", "J", "2026-06-17T04:00:00.000Z", "Áustria", "Jordânia", "Levi's Stadium"],
    [21, "Grupo", "K", "2026-06-17T17:00:00.000Z", "Colômbia", "Uzbequistão", "Estadio Azteca"],
    [22, "Grupo", "K", "2026-06-17T17:00:00.000Z", "Portugal", "RD Congo", "Arrowhead Stadium"],
    [23, "Grupo", "L", "2026-06-17T20:00:00.000Z", "Inglaterra", "Croácia", "AT&T Stadium"],
    [24, "Grupo", "L", "2026-06-17T23:00:00.000Z", "Panamá", "Gana", "BMO Field"],
    [25, "Grupo", "A", "2026-06-18T16:00:00.000Z", "África do Sul", "República Tcheca", "Mercedes-Benz Stadium"],
    [26, "Grupo", "B", "2026-06-18T19:00:00.000Z", "Suíça", "Bósnia e Herzegovina", "SoFi Stadium"],
    [27, "Grupo", "B", "2026-06-18T22:00:00.000Z", "Canadá", "Catar", "BC Place"],
    [28, "Grupo", "A", "2026-06-19T01:00:00.000Z", "México", "Coreia do Sul", "Estadio Akron (Guadalajara)"],
    [29, "Grupo", "D", "2026-06-19T19:00:00.000Z", "Estados Unidos", "Austrália", "Lumen Field"],
    [30, "Grupo", "C", "2026-06-19T22:00:00.000Z", "Marrocos", "Escócia", "Gillette Stadium"],
    [31, "Grupo", "C", "2026-06-19T22:30:00.000Z", "Brasil", "Haiti", "Lincoln Financial Field"],
    [32, "Grupo", "D", "2026-06-20T03:00:00.000Z", "Paraguai", "Turquia", "Levi's Stadium"],
    [33, "Grupo", "F", "2026-06-20T17:00:00.000Z", "Países Baixos", "Suécia", "Arrowhead Stadium"],
    [34, "Grupo", "E", "2026-06-20T20:00:00.000Z", "Alemanha", "Costa do Marfim", "BMO Field"],
    [35, "Grupo", "E", "2026-06-21T00:00:00.000Z", "Equador", "Curaçao", "Arrowhead Stadium"],
    [36, "Grupo", "F", "2026-06-21T04:00:00.000Z", "Japão", "Tunísia", "Estadio BBVA (Monterrey)"],
    [37, "Grupo", "H", "2026-06-21T16:00:00.000Z", "Espanha", "Arábia Saudita", "Mercedes-Benz Stadium"],
    [38, "Grupo", "G", "2026-06-21T19:00:00.000Z", "Bélgica", "Irã", "SoFi Stadium"],
    [39, "Grupo", "H", "2026-06-21T22:00:00.000Z", "Uruguai", "Cabo Verde", "Hard Rock Stadium"],
    [40, "Grupo", "G", "2026-06-22T01:00:00.000Z", "Egito", "Nova Zelândia", "BC Place"],
    [41, "Grupo", "J", "2026-06-22T17:00:00.000Z", "Argentina", "Áustria", "AT&T Stadium"],
    [42, "Grupo", "I", "2026-06-22T21:00:00.000Z", "França", "Iraque", "Lincoln Financial Field"],
    [43, "Grupo", "I", "2026-06-23T00:00:00.000Z", "Senegal", "Noruega", "MetLife Stadium"],
    [44, "Grupo", "J", "2026-06-23T03:00:00.000Z", "Argélia", "Jordânia", "Levi's Stadium"],
    [45, "Grupo", "K", "2026-06-23T17:00:00.000Z", "Portugal", "Uzbequistão", "Arrowhead Stadium"],
    [46, "Grupo", "L", "2026-06-23T20:00:00.000Z", "Inglaterra", "Gana", "Gillette Stadium"],
    [47, "Grupo", "L", "2026-06-23T23:00:00.000Z", "Croácia", "Panamá", "BMO Field"],
    [48, "Grupo", "K", "2026-06-24T02:00:00.000Z", "Colômbia", "RD Congo", "Estadio Akron (Guadalajara)"],
    [49, "Grupo", "B", "2026-06-24T19:00:00.000Z", "Canadá", "Suíça", "BC Place"],
    [50, "Grupo", "B", "2026-06-24T19:00:00.000Z", "Catar", "Bósnia e Herzegovina", "Lumen Field"],
    [51, "Grupo", "C", "2026-06-24T22:00:00.000Z", "Brasil", "Escócia", "Hard Rock Stadium"],
    [52, "Grupo", "C", "2026-06-24T22:00:00.000Z", "Marrocos", "Haiti", "Mercedes-Benz Stadium"],
    [53, "Grupo", "A", "2026-06-25T01:00:00.000Z", "México", "República Tcheca", "Estadio Azteca"],
    [54, "Grupo", "A", "2026-06-25T01:00:00.000Z", "Coreia do Sul", "África do Sul", "Estadio BBVA (Monterrey)"],
    [55, "Grupo", "E", "2026-06-25T20:00:00.000Z", "Alemanha", "Equador", "MetLife Stadium"],
    [56, "Grupo", "E", "2026-06-25T20:00:00.000Z", "Costa do Marfim", "Curaçao", "Lincoln Financial Field"],
    [57, "Grupo", "F", "2026-06-25T23:00:00.000Z", "Países Baixos", "Tunísia", "Arrowhead Stadium"],
    [58, "Grupo", "F", "2026-06-25T23:00:00.000Z", "Japão", "Suécia", "AT&T Stadium"],
    [59, "Grupo", "D", "2026-06-26T02:00:00.000Z", "Estados Unidos", "Turquia", "SoFi Stadium"],
    [60, "Grupo", "D", "2026-06-26T02:00:00.000Z", "Austrália", "Paraguai", "Levi's Stadium"],
    [61, "Grupo", "I", "2026-06-26T19:00:00.000Z", "França", "Noruega", "Gillette Stadium"],
    [62, "Grupo", "I", "2026-06-26T19:00:00.000Z", "Senegal", "Iraque", "BMO Field"],
    [63, "Grupo", "H", "2026-06-27T00:00:00.000Z", "Espanha", "Uruguai", "Estadio Akron (Guadalajara)"],
    [64, "Grupo", "H", "2026-06-27T00:00:00.000Z", "Arábia Saudita", "Cabo Verde", "Arrowhead Stadium"],
    [65, "Grupo", "G", "2026-06-27T03:00:00.000Z", "Bélgica", "Nova Zelândia", "BC Place"],
    [66, "Grupo", "G", "2026-06-27T03:00:00.000Z", "Irã", "Egito", "Lumen Field"],
    [67, "Grupo", "L", "2026-06-27T21:00:00.000Z", "Inglaterra", "Panamá", "MetLife Stadium"],
    [68, "Grupo", "L", "2026-06-27T21:00:00.000Z", "Croácia", "Gana", "Lincoln Financial Field"],
    [69, "Grupo", "K", "2026-06-27T23:30:00.000Z", "Portugal", "Colômbia", "Hard Rock Stadium"],
    [70, "Grupo", "K", "2026-06-27T23:30:00.000Z", "Uzbequistão", "RD Congo", "Mercedes-Benz Stadium"],
    [71, "Grupo", "J", "2026-06-28T02:00:00.000Z", "Argentina", "Jordânia", "AT&T Stadium"],
    [72, "Grupo", "J", "2026-06-28T02:00:00.000Z", "Áustria", "Argélia", "Arrowhead Stadium"],
  ];

  const knockoutMatches: KnockoutMatchRow[] = [
    [73,  "16avos", null, "2026-06-28T20:00:00.000Z", null, null, "SoFi Stadium", "1º Grupo A", "Melhor 3º (TBD)"],
    [74,  "16avos", null, "2026-06-29T16:00:00.000Z", null, null, "Gillette Stadium", "1º Grupo B", "Melhor 3º (TBD)"],
    [75,  "16avos", null, "2026-06-29T19:00:00.000Z", null, null, "Estadio BBVA (Monterrey)", "1º Grupo C", "Melhor 3º (TBD)"],
    [76,  "16avos", null, "2026-06-29T22:00:00.000Z", null, null, "Arrowhead Stadium", "1º Grupo D", "Melhor 3º (TBD)"],
    [77,  "16avos", null, "2026-06-30T16:00:00.000Z", null, null, "MetLife Stadium", "2º Grupo A", "2º Grupo B"],
    [78,  "16avos", null, "2026-06-30T19:00:00.000Z", null, null, "AT&T Stadium", "2º Grupo C", "2º Grupo D"],
    [79,  "16avos", null, "2026-06-30T22:00:00.000Z", null, null, "Estadio Azteca", "1º Grupo E", "Melhor 3º (TBD)"],
    [80,  "16avos", null, "2026-07-01T16:00:00.000Z", null, null, "Mercedes-Benz Stadium", "1º Grupo F", "Melhor 3º (TBD)"],
    [81,  "16avos", null, "2026-07-01T19:00:00.000Z", null, null, "Levi's Stadium", "1º Grupo G", "Melhor 3º (TBD)"],
    [82,  "16avos", null, "2026-07-01T22:00:00.000Z", null, null, "Lumen Field", "1º Grupo H", "Melhor 3º (TBD)"],
    [83,  "16avos", null, "2026-07-02T16:00:00.000Z", null, null, "BMO Field", "2º Grupo E", "2º Grupo F"],
    [84,  "16avos", null, "2026-07-02T19:00:00.000Z", null, null, "Rose Bowl Stadium", "2º Grupo G", "2º Grupo H"],
    [85,  "16avos", null, "2026-07-02T22:00:00.000Z", null, null, "BC Place", "1º Grupo I", "Melhor 3º (TBD)"],
    [86,  "16avos", null, "2026-07-03T16:00:00.000Z", null, null, "Hard Rock Stadium", "1º Grupo J", "Melhor 3º (TBD)"],
    [87,  "16avos", null, "2026-07-03T19:00:00.000Z", null, null, "Arrowhead Stadium", "1º Grupo K", "Melhor 3º (TBD)"],
    [88,  "16avos", null, "2026-07-03T22:00:00.000Z", null, null, "AT&T Stadium", "1º Grupo L", "Melhor 3º (TBD)"],
    [89,  "Oitavas", null, "2026-07-04T16:00:00.000Z", null, null, "Lincoln Financial Field", "Vencedor J73", "Vencedor J74"],
    [90,  "Oitavas", null, "2026-07-04T20:00:00.000Z", null, null, "Arrowhead Stadium", "Vencedor J75", "Vencedor J76"],
    [91,  "Oitavas", null, "2026-07-05T16:00:00.000Z", null, null, "MetLife Stadium", "Vencedor J77", "Vencedor J78"],
    [92,  "Oitavas", null, "2026-07-05T20:00:00.000Z", null, null, "Estadio Azteca", "Vencedor J79", "Vencedor J80"],
    [93,  "Oitavas", null, "2026-07-06T16:00:00.000Z", null, null, "AT&T Stadium", "Vencedor J81", "Vencedor J82"],
    [94,  "Oitavas", null, "2026-07-06T20:00:00.000Z", null, null, "Lumen Field", "Vencedor J83", "Vencedor J84"],
    [95,  "Oitavas", null, "2026-07-07T16:00:00.000Z", null, null, "Mercedes-Benz Stadium", "Vencedor J85", "Vencedor J86"],
    [96,  "Oitavas", null, "2026-07-07T20:00:00.000Z", null, null, "BC Place", "Vencedor J87", "Vencedor J88"],
    [97,  "Quartas", null, "2026-07-09T20:00:00.000Z", null, null, "Gillette Stadium", "Vencedor J89", "Vencedor J90"],
    [98,  "Quartas", null, "2026-07-10T20:00:00.000Z", null, null, "Rose Bowl Stadium", "Vencedor J91", "Vencedor J92"],
    [99,  "Quartas", null, "2026-07-11T20:00:00.000Z", null, null, "Hard Rock Stadium", "Vencedor J93", "Vencedor J94"],
    [100, "Quartas", null, "2026-07-12T00:00:00.000Z", null, null, "Arrowhead Stadium", "Vencedor J95", "Vencedor J96"],
    [101, "Semi", null, "2026-07-15T00:00:00.000Z", null, null, "MetLife Stadium", "Vencedor J97", "Vencedor J98"],
    [102, "Semi", null, "2026-07-16T00:00:00.000Z", null, null, "AT&T Stadium", "Vencedor J99", "Vencedor J100"],
    [103, "3lugar", null, "2026-07-18T20:00:00.000Z", null, null, "Hard Rock Stadium", "Perdedor J101", "Perdedor J102"],
    [104, "Final", null, "2026-07-19T20:00:00.000Z", null, null, "MetLife Stadium", "Vencedor J101", "Vencedor J102"],
  ];

  for (const [matchNumber, phase, group, date, home, away, stadiumName] of groupMatches) {
    await prisma.match.create({
      data: {
        matchNumber: matchNumber as number,
        phase: phase as string,
        group: group as string,
        date: new Date(date as string),
        homeTeamId: teamMap.get(home as string) ?? null,
        awayTeamId: teamMap.get(away as string) ?? null,
        stadiumId: stadiumMap.get(stadiumName as string)!,
        status: "scheduled",
      },
    });
  }

  for (const [matchNumber, phase, group, date, , , stadiumName, tbd1, tbd2] of knockoutMatches) {
    await prisma.match.create({
      data: {
        matchNumber: matchNumber as number,
        phase: phase as string,
        group: group as string | null,
        date: new Date(date as string),
        homeTeamId: null,
        awayTeamId: null,
        stadiumId: stadiumMap.get(stadiumName as string)!,
        status: "scheduled",
        tbd1: tbd1 as string,
        tbd2: tbd2 as string,
      },
    });
  }

  console.log("Seed concluído! 48 times, 16 estádios e 104 jogos criados.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
