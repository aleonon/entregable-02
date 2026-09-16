export type Habitat = "Pacífico" | "Atlántico" | "Índico" | "Glaciar Ártico" | "Glaciar Antártico";

export interface Criatura {
    readonly id: number;
    nombre: string;
    habitat: Habitat;
    habilidad: string;
    nivel: number;
    amistosa: boolean;
    readonly creadaEn: string;
}

export type EntradaCriatura = Omit<Criatura, "id" | "creadaEn">;