const NAME_MAP: Record<string, string> = {
  // Peito
  "supino reto": "barbell bench press",
  "supino inclinado": "incline barbell bench press",
  "supino declinado": "decline barbell bench press",
  "crucifixo": "dumbbell fly",
  "crucifixo inclinado": "incline dumbbell fly",
  "crossover": "cable crossover",
  "flexão": "push up",
  "flexão de braço": "push up",
  // Costas
  "puxada frontal": "lat pulldown",
  "remada curvada": "bent over barbell row",
  "remada unilateral": "dumbbell one arm row",
  "remada sentado": "cable seated row",
  "barra fixa": "pull up",
  "levantamento terra": "deadlift",
  "remada alta": "barbell upright row",
  // Ombros
  "desenvolvimento": "barbell overhead press",
  "desenvolvimento com halteres": "dumbbell shoulder press",
  "elevação lateral": "dumbbell lateral raise",
  "elevação frontal": "dumbbell front raise",
  "crucifixo inverso": "dumbbell bent over lateral raise",
  // Bíceps
  "rosca direta": "barbell curl",
  "rosca alternada": "dumbbell alternate bicep curl",
  "rosca martelo": "hammer curl",
  "rosca concentrada": "dumbbell concentration curl",
  "rosca inclinada": "incline dumbbell curl",
  // Tríceps
  "tríceps pulley": "cable pushdown",
  "tríceps francês": "lying triceps press",
  "fundos": "dips",
  "tríceps testa": "ez bar lying close grip press",
  "tríceps coice": "dumbbell kickback",
  "tríceps na polia": "cable pushdown",
  // Pernas
  "agachamento": "barbell squat",
  "agachamento livre": "barbell squat",
  "leg press": "leg press",
  "cadeira extensora": "leg extension",
  "mesa flexora": "leg curl",
  "panturrilha em pé": "standing calf raise",
  "panturrilha sentado": "seated calf raise",
  "afundo": "dumbbell lunge",
  "stiff": "barbell romanian deadlift",
  "levantamento terra romeno": "barbell romanian deadlift",
  "abdutora": "hip abduction",
  "adutora": "hip adduction",
  "glúteo no cabo": "cable hip extension",
  // Abdômen
  "abdominal": "crunch",
  "prancha": "plank",
  "abdominal remador": "bicycle crunch",
  "elevação de pernas": "leg raises",
  "abdominal oblíquo": "side crunch",
};

export function mapToEnglish(portugueseName: string): string {
  const key = portugueseName.toLowerCase().trim();
  // exact match
  if (NAME_MAP[key]) return NAME_MAP[key];
  // partial match (first word)
  const firstWord = key.split(" ")[0];
  const partial = Object.entries(NAME_MAP).find(([k]) => k.startsWith(firstWord));
  return partial ? partial[1] : portugueseName;
}
