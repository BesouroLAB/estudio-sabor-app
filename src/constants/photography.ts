
import { 
  Pizza, 
  Beef, 
  Fish, 
  Cake, 
  Salad, 
  Coffee, 
  Sandwich, 
  Soup, 
  IceCream, 
  Drumstick, 
  Croissant, 
  Flame, 
  UtensilsCrossed, 
  GlassWater, 
  Beer, 
  Apple, 
  Cookie,
  ChefHat,
  Truck,
  Sparkles
} from "lucide-react";

// Types ported from ai-suite/types.ts
export interface TechnicalDetails {
    title: string;
    description: string;
    pro_tips: string[];
}

export interface PhotographyOption {
    name: string;
    short_info: string;
    keywords: string[];
    negative_keywords: string[];
    icon: string;
    technical_details: TechnicalDetails;
}

export interface PresetData {
    cameraName: string;
    depthOfFieldName: string;
    lightingName: string;
    angle: string;
    stylePlaceholder: string;
    aspectRatio: string;
}

export interface FoodPreset {
    id: string;
    name: string;
    description: string;
    icon: any; // Lucide icon component
    color: string;
    preset: PresetData;
}

// Technical Dictionaries (Ported from ai-suite/food_options.ts)
export const CAMERAS: PhotographyOption[] = [
    {
        name: "Hasselblad X2D 100C + 90mm f/2.5",
        short_info: "Médio formato para tons suaves e detalhes macro.",
        keywords: ["hasselblad x2d 100c", "90mm f/2.5 lens", "f/2.5 aperture", "medium format", "soft tones", "pastel colors", "macro detail", "texture accent", "creamy highlights", "soft shadows"],
        negative_keywords: ["non photorealistic", "oversharpened", "digital look", "harsh shadows", "direct sunlight", "artificial lighting", "plastic look", "unnatural gloss"],
        icon: "CameraIcon",
        technical_details: {
            title: "Hasselblad X2D: A Arte da Cor",
            description: "Cores ricas e detalhes surreais.",
            pro_tips: ["Ideal para criar um look editorial e de alta classe."]
        }
    },
    {
        name: "Nikon Z8 + 85mm f/1.8",
        short_info: "Compressão dramática para carnes e pratos robustos.",
        keywords: ["nikon z8", "85mm f/1.8 lens", "f/1.8 aperture", "mirrorless full-frame", "grill char detail", "moist interior", "glistening surface", "smoky highlights", "rich contrast"],
        negative_keywords: ["non photorealistic", "bright scene", "flat lighting", "no shadows", "plastic look", "waxy meat surface"],
        icon: "CameraIcon",
        technical_details: {
            title: "Nikon Z8: O Mestre do Drama",
            description: "Poderosa para carnes grelhadas.",
            pro_tips: ["Excelente para capturar o brilho e a suculência da carne."]
        }
    },
    {
        name: "Canon EOS R5 + 50mm f/2.8",
        short_info: "Alta resolução para flat lays nítidos.",
        keywords: ["canon eos r5", "50mm f/2.8 lens", "f/4 aperture", "high resolution", "vibrant greens", "fresh texture", "natural sheen", "ingredient detail"],
        negative_keywords: ["blurry", "low resolution", "grainy", "dramatic", "low key", "shallow depth of field"],
        icon: "CameraIcon",
        technical_details: {
            title: "Canon R5: Clareza de Cima",
            description: "Perfeita para fotos de flat lay.",
            pro_tips: ["Use para saladas e pratos frescos."]
        }
    },
    {
        name: "Panasonic Lumix S5 II + 85mm f/1.8",
        short_info: "Look cinematográfico para bebidas.",
        keywords: ["panasonic lumix s5 ii", "85mm f/1.8 lens", "f/1.8 aperture", "cinematic color", "low light", "warm tones", "liquid clarity", "droplets", "glass reflections", "rim lighting"],
        negative_keywords: ["front lighting", "flat light", "glare", "plastic look", "unnatural bubbles"],
        icon: "CameraIcon",
        technical_details: {
            title: "Lumix S5 II: Cinematográfico",
            description: "Ciência de cores rica.",
            pro_tips: ["Excelente para capturar o brilho de líquidos."]
        }
    },
    {
        name: "Canon EOS R3 + 50mm f/1.4",
        short_info: "Look profissional para lanches.",
        keywords: ["canon eos r3", "50mm f/1.4 lens", "f/1.4 aperture", "balanced colors", "texture", "juicy interior", "melting cheese", "crisp lettuce", "layered structure"],
        negative_keywords: ["oversaturated", "dull colors", "soggy bun", "flattened layers", "plastic texture"],
        icon: "CameraIcon",
        technical_details: {
            title: "Canon R3: Velocidade e Textura",
            description: "Ideal para capturar o momento perfeito.",
            pro_tips: ["Aberturas amplas criam desfoque dramático."]
        }
    },
    {
        name: "Canon EOS R6 II + 85mm f/2.0",
        short_info: "Desempenho em baixa luz para pratos quentes.",
        keywords: ["canon eos r6 ii", "85mm f/2.0 lens", "f/2.0 aperture", "low light", "warm tones", "noodle texture", "sauce reflection", "broth clarity"],
        negative_keywords: ["harsh shadows", "direct sunlight", "soggy noodles", "unnatural gloss"],
        icon: "CameraIcon",
        technical_details: {
            title: "Canon R6 II: Rainha da Baixa Luz",
            description: "Ideal para ambientes escuros.",
            pro_tips: ["Excelente para pratos quentes como massas."]
        }
    },
    {
        name: "Sony A7 IV + 35mm f/2.8",
        short_info: "Versátil e nítida para pizzas.",
        keywords: ["sony a7 iv", "35mm f/2.8 lens", "f/2.8 aperture", "balanced colors", "texture", "cheese stretch", "crust detail", "melted edges"],
        negative_keywords: ["burned cheese", "plastic look", "cheese glare", "floating slice"],
        icon: "CameraIcon",
        technical_details: {
            title: "Sony A7 IV: Versatilidade",
            description: "Equilibrada para e-commerce.",
            pro_tips: ["Ótima para criar um look de estilo de vida."]
        }
    },
    {
        name: "Ricoh GR IIIx + 40mm f/2.8",
        short_info: "Look minimalista para comida japonesa.",
        keywords: ["ricoh gr iii x", "40mm f/2.8 lens", "f/2.8 aperture", "minimalism", "clean composition", "rice grain detail", "sashimi gloss", "negative space"],
        negative_keywords: ["bright scene", "flat lighting", "plastic sushi look"],
        icon: "CameraIcon",
        technical_details: {
            title: "Ricoh GR IIIx: Minimalismo",
            description: "Lente incrivelmente nítida.",
            pro_tips: ["Incentiva composições cuidadosas."]
        }
    },
    {
        name: "Sigma fp L + 35mm f/2.0",
        short_info: "Cores precisas para bowls.",
        keywords: ["sigma fp l", "35mm f/2.0 lens", "f/4 aperture", "color accurate", "fruit detail", "granola texture", "smooth açaí surface"],
        negative_keywords: ["oversaturated", "harsh shadows", "plastic fruit", "blurry background"],
        icon: "CameraIcon",
        technical_details: {
            title: "Sigma fp L: Precisão",
            description: "Sensor de 61MP para cores vivas.",
            pro_tips: ["Ideal para pratos coloridos."]
        }
    },
    {
        name: "Fujifilm X-H2S + 35mm f/1.4",
        short_info: "Look de filme para cafeterias.",
        keywords: ["fujifilm x-h2s", "35mm f/1.4 lens", "f/1.4 aperture", "film look", "soft tones", "coffee crema detail", "cozy atmosphere"],
        negative_keywords: ["harsh colors", "digital look", "oversharpened"],
        icon: "CameraIcon",
        technical_details: {
            title: "Fujifilm X-H2S: Analógico",
            description: "Cores suaves e atmosfera aconchegante.",
            pro_tips: ["Use para capturar o vapor subindo do café."]
        }
    },
    {
        name: "Sony A1 + 105mm f/2.8",
        short_info: "Resolução máxima para pães.",
        keywords: ["sony a1", "105mm f/2.8 lens", "f/2.8 aperture", "high resolution", "crust detail", "flour dust", "crumb texture"],
        negative_keywords: ["plastic bread", "burnt crust", "digital look"],
        icon: "CameraIcon",
        technical_details: {
            title: "Sony A1: Alta Resolução",
            description: "Captura cada detalhe da crosta.",
            pro_tips: ["Use com contraluz para realçar a textura."]
        }
    },
    {
        name: "iPhone 15 Pro",
        short_info: "Look vibrante para redes sociais.",
        keywords: ["iphone 15 pro", "smartphone photography", "hdr", "vibrant", "social media look", "sharp", "salsa gloss"],
        negative_keywords: ["dslr look", "film grain", "analog", "soft light"],
        icon: "CameraIcon",
        technical_details: {
            title: "iPhone 15 Pro: Social-First",
            description: "Nítida e vibrante.",
            pro_tips: ["Ideal para tacos e burritos."]
        }
    }
];

export const LIGHTING_STYLES: PhotographyOption[] = [
    {
        name: "Luz Lateral Difusa (Janela)",
        short_info: "Suave e natural.",
        keywords: ["soft side light", "natural light", "diffused light", "window lighting"],
        negative_keywords: ["harsh shadows", "flat lighting"],
        icon: "Sun",
        technical_details: { title: "Luz Lateral", description: "O padrão de ouro da gastronomia.", pro_tips: ["Dá volume e dimensão."] }
    },
    {
        name: "Golden Hour (Luz Quente Suave)",
        short_info: "Tom aconchegante.",
        keywords: ["golden hour", "warm tones", "sunset light", "rustic ambiance"],
        negative_keywords: ["flat color", "too warm"],
        icon: "SunMedium",
        technical_details: { title: "Golden Hour", description: "Luz dourada nostálgica.", pro_tips: ["Ideal para rusticidade."] }
    },
    {
        name: "Low-Key (Luz Dramática)",
        short_info: "Alto contraste.",
        keywords: ["low key", "high contrast", "dramatic food photo", "shadows"],
        negative_keywords: ["too much shadow", "poor separation"],
        icon: "Moon",
        technical_details: { title: "Dramática", description: "Look sofisticado e misterioso.", pro_tips: ["Excelente para carnes."] }
    },
    {
        name: "Luz de Estúdio Branca (Catálogo)",
        short_info: "Limpa e uniforme.",
        keywords: ["studio white light", "clean lighting", "neutral look"],
        negative_keywords: ["unrealistic colors", "flat image"],
        icon: "Zap",
        technical_details: { title: "Estúdio", description: "Padrão e-commerce.", pro_tips: ["Máxima fidelidade de cores."] }
    },
    {
        name: "Backlight (Contraluz)",
        short_info: "Realça brilho e vapor.",
        keywords: ["backlight", "rim light", "glowing liquids", "vapor"],
        negative_keywords: ["too dark foreground"],
        icon: "Sparkles",
        technical_details: { title: "Contraluz", description: "Faz o prato brilhar.", pro_tips: ["Ideal para sopas e drinks."] }
    }
];

export const ANGLES: PhotographyOption[] = [
    {
        name: "Flat Lay 90° (Vista de Cima)",
        short_info: "Ideal para pizzas e bowls.",
        keywords: ["flat lay", "overhead shot", "90-degree angle", "top down"],
        negative_keywords: ["cluttered", "unnatural perspective"],
        icon: "Maximize",
        technical_details: { title: "Top Down", description: "90 graus perfeitos.", pro_tips: ["Destaque formas geométricas."] }
    },
    {
        name: "Ângulo 45° (Visão da Mesa)",
        short_info: "Visão natural matadora.",
        keywords: ["45-degree food shot", "natural perspective", "table view"],
        negative_keywords: ["disproportionate", "unnatural perspective"],
        icon: "Square",
        technical_details: { title: "45 Graus", description: "Simula o olhar do cliente.", pro_tips: ["Mais versátil de todos."] }
    },
    {
        name: "Nível do Olhar 0° (Visão Frontal)",
        short_info: "Para camadas e altura.",
        keywords: ["eye-level food shot", "hero food angle", "centered food"],
        negative_keywords: ["distorted layers", "unfocused food"],
        icon: "Minus",
        technical_details: { title: "Frontal", description: "Foca na arquitetura do prato.", pro_tips: ["Essencial para burgers."] }
    },
    {
        name: "Close-up/Macro (Detalhe)",
        short_info: "Foco em texturas gulosas.",
        keywords: ["close up", "extreme detail", "texture focus"],
        negative_keywords: ["over-sharpened", "low resolution"],
        icon: "Search",
        technical_details: { title: "Macro", description: "Abre o apetite pelo detalhe.", pro_tips: ["Mostre o queijo derretendo."] }
    }
];

export const DEPTHS_OF_FIELD: PhotographyOption[] = [
    {
        name: "Fundo Desfocado",
        short_info: "Look gourmet premium.",
        keywords: ["shallow depth of field", "blurred background", "creamy bokeh", "f/2.8"],
        negative_keywords: ["sharp background"],
        icon: "Sun",
        technical_details: { title: "Shallow", description: "Isola o prato.", pro_tips: ["Foco total no produto."] }
    },
    {
        name: "Foco Natural",
        short_info: "Equilíbrio ambiente.",
        keywords: ["balanced focus", "f/5.6", "natural storytelling focus"],
        negative_keywords: ["too much blur"],
        icon: "Circle",
        technical_details: { title: "Natural", description: "Storytelling equilibrado.", pro_tips: ["Bom para mostrar o restaurante."] }
    },
    {
        name: "Tudo Nítido",
        short_info: "Ideal para e-commerce.",
        keywords: ["deep depth of field", "sharp everywhere", "f/11"],
        negative_keywords: ["blurry background"],
        icon: "Grid",
        technical_details: { title: "Deep", description: "Cada grão visível.", pro_tips: ["Ideal para saladas."] }
    }
];

// Complete 20 FOOD_PRESETS (Expert Knowledge)
export const FOOD_PRESETS: FoodPreset[] = [
    { 
        id: "sobremesa", 
        name: 'Sobremesas & Doces', 
        description: 'Foco em brilho e texturas delicadas.', 
        icon: Cake, 
        color: "from-pink-400 to-purple-400",
        preset: { cameraName: 'Hasselblad X2D 100C + 90mm f/2.5', depthOfFieldName: 'Fundo Desfocado', lightingName: 'Luz Lateral Difusa (Janela)', angle: 'Close-up/Macro (Detalhe)', stylePlaceholder: 'Torta de frutas no prato de cerâmica.', aspectRatio: '1:1' } 
    },
    { 
        id: "carne", 
        name: 'Carnes & Churrasco', 
        description: 'Suculência e marcas de grelha.', 
        icon: Beef, 
        color: "from-red-700 to-orange-700",
        preset: { cameraName: 'Nikon Z8 + 85mm f/1.8', depthOfFieldName: 'Fundo Desfocado', lightingName: 'Low-Key (Luz Dramática)', angle: 'Nível do Olhar 0° (Visão Frontal)', stylePlaceholder: 'Picanha suculenta na tábua.', aspectRatio: '4:3' } 
    },
    { 
        id: "salada", 
        name: 'Saladas & Fit', 
        description: 'Luz limpa e frescor vibrante.', 
        icon: Salad, 
        color: "from-green-500 to-emerald-400",
        preset: { cameraName: 'Canon EOS R5 + 50mm f/2.8', depthOfFieldName: 'Tudo Nítido', lightingName: 'Luz de Estúdio Branca (Catálogo)', angle: 'Flat Lay 90° (Vista de Cima)', stylePlaceholder: 'Bowl de salada fresca.', aspectRatio: '1:1' } 
    },
    { 
        id: "drink", 
        name: 'Bebidas & Drinks', 
        description: 'Brilho líquido e refrescância.', 
        icon: GlassWater, 
        color: "from-sky-400 to-blue-500",
        preset: { cameraName: 'Panasonic Lumix S5 II + 85mm f/1.8', depthOfFieldName: 'Fundo Desfocado', lightingName: 'Backlight (Contraluz)', angle: 'Nível do Olhar 0° (Visão Frontal)', stylePlaceholder: 'Drink refrescante com gelo.', aspectRatio: '3:4' } 
    },
    { 
        id: "hamburger", 
        name: 'Hambúrgueres', 
        description: 'Ângulo heroico para camadas.', 
        icon: Beef, 
        color: "from-amber-600 to-yellow-500",
        preset: { cameraName: 'Canon EOS R3 + 50mm f/1.4', depthOfFieldName: 'Fundo Desfocado', lightingName: 'Golden Hour (Luz Quente Suave)', angle: 'Nível do Olhar 0° (Visão Frontal)', stylePlaceholder: 'Hambúrguer com queijo derretido.', aspectRatio: '1:1' } 
    },
    { 
        id: "massa", 
        name: 'Massas & Risotos', 
        description: 'Confortável e apetitoso.', 
        icon: UtensilsCrossed, 
        color: "from-orange-400 to-amber-600",
        preset: { cameraName: 'Canon EOS R6 II + 85mm f/2.0', depthOfFieldName: 'Fundo Desfocado', lightingName: 'Luz Lateral Difusa (Janela)', angle: 'Ângulo 45° (Visão da Mesa)', stylePlaceholder: 'Prato de massa italiana.', aspectRatio: '4:3' } 
    },
    { 
        id: "pizza", 
        name: 'Pizza', 
        description: 'Crocância e queijo derretido.', 
        icon: Pizza, 
        color: "from-red-500 to-orange-500",
        preset: { cameraName: 'Sony A7 IV + 35mm f/2.8', depthOfFieldName: 'Foco Natural', lightingName: 'Luz Lateral Difusa (Janela)', angle: 'Flat Lay 90° (Vista de Cima)', stylePlaceholder: 'Pizza artesanal no forno.', aspectRatio: '1:1' } 
    },
    { 
        id: "sushi", 
        name: 'Comida Japonesa', 
        description: 'Minimalismo e elegância.', 
        icon: Fish, 
        color: "from-rose-400 to-pink-500",
        preset: { cameraName: 'Ricoh GR IIIx + 40mm f/2.8', depthOfFieldName: 'Fundo Desfocado', lightingName: 'Low-Key (Luz Dramática)', angle: 'Ângulo 45° (Visão da Mesa)', stylePlaceholder: 'Combinado de sushi premium.', aspectRatio: '4:3' } 
    },
    { 
        id: "brasileira", 
        name: 'Comida Brasileira', 
        description: 'Autêntico e convidativo.', 
        icon: Soup, 
        color: "from-amber-500 to-red-500",
        preset: { cameraName: 'Canon EOS R6 II + 50mm f/1.8', depthOfFieldName: 'Foco Natural', lightingName: 'Luz Lateral Difusa (Janela)', angle: 'Ângulo 45° (Visão da Mesa)', stylePlaceholder: 'Feijoada ou PF suculento.', aspectRatio: '4:3' } 
    },
    { 
        id: "padaria", 
        name: 'Padaria & Pães', 
        description: 'Realça a crosta e o miolo.', 
        icon: Croissant, 
        color: "from-amber-700 to-yellow-700",
        preset: { cameraName: 'Sony A1 + 105mm f/2.8', depthOfFieldName: 'Fundo Desfocado', lightingName: 'Golden Hour (Luz Quente Suave)', angle: 'Close-up/Macro (Detalhe)', stylePlaceholder: 'Pão artesanal crocante.', aspectRatio: '4:3' } 
    },
    { 
        id: "bowls", 
        name: 'Açaí & Poke', 
        description: 'Cores e frescor de cima.', 
        icon: Apple, 
        color: "from-purple-600 to-indigo-600",
        preset: { cameraName: 'Sigma fp L + 35mm f/2.0', depthOfFieldName: 'Tudo Nítido', lightingName: 'Luz Lateral Difusa (Janela)', angle: 'Flat Lay 90° (Vista de Cima)', stylePlaceholder: 'Bowl de açaí colorido.', aspectRatio: '1:1' } 
    },
    { 
        id: "cafe", 
        name: 'Cafeteria', 
        description: 'Moody e aconchegante.', 
        icon: Coffee, 
        color: "from-amber-800 to-amber-600",
        preset: { cameraName: 'Fujifilm X-H2S + 35mm f/1.4', depthOfFieldName: 'Fundo Desfocado', lightingName: 'Luz Lateral Difusa (Janela)', angle: 'Ângulo 45° (Visão da Mesa)', stylePlaceholder: 'Cappuccino com latte art.', aspectRatio: '3:4' } 
    },
    { 
        id: "frutosmar", 
        name: 'Frutos do Mar', 
        description: 'Brilho e frescor marinho.', 
        icon: Fish, 
        color: "from-cyan-500 to-blue-600",
        preset: { cameraName: 'Sony A7 IV + 100mm f/2.8', depthOfFieldName: 'Fundo Desfocado', lightingName: 'Luz Lateral Difusa (Janela)', angle: 'Ângulo 45° (Visão da Mesa)', stylePlaceholder: 'Camarões ou peixe grelhado.', aspectRatio: '4:3' } 
    },
    { 
        id: "lanche", 
        name: 'Lanches & Wraps', 
        description: 'Ideal para o dia a dia.', 
        icon: Sandwich, 
        color: "from-orange-500 to-yellow-500",
        preset: { cameraName: 'iPhone 15 Pro', depthOfFieldName: 'Fundo Desfocado', lightingName: 'Luz Lateral Difusa (Janela)', angle: 'Ângulo 45° (Visão da Mesa)', stylePlaceholder: 'Sanduíche bem montado.', aspectRatio: '1:1' } 
    },
    { 
        id: "sopa", 
        name: 'Sopas & Caldos', 
        description: 'Textura e calor em destaque.', 
        icon: Soup, 
        color: "from-orange-600 to-red-600",
        preset: { cameraName: 'Panasonic Lumix S5 II + 50mm f/1.8', depthOfFieldName: 'Foco Natural', lightingName: 'Backlight (Contraluz)', angle: 'Flat Lay 90° (Vista de Cima)', stylePlaceholder: 'Sopa cremosa quente.', aspectRatio: '1:1' } 
    },
    { 
        id: "mexicana", 
        name: 'Mexicana', 
        description: 'Vibrante e apimentada.', 
        icon: Flame, 
        color: "from-red-600 to-yellow-600",
        preset: { cameraName: 'iPhone 15 Pro', depthOfFieldName: 'Fundo Desfocado', lightingName: 'Golden Hour (Luz Quente Suave)', angle: 'Close-up/Macro (Detalhe)', stylePlaceholder: 'Tacos e nachos coloridos.', aspectRatio: '1:1' } 
    },
    {
        id: "petisco",
        name: 'Petiscos & Porções',
        description: 'Para compartilhar e celebrar.',
        icon: Cookie,
        color: "from-yellow-600 to-amber-700",
        preset: { cameraName: 'Sony A7 IV + 35mm f/2.8', depthOfFieldName: 'Foco Natural', lightingName: 'Golden Hour (Luz Quente Suave)', angle: 'Ângulo 45° (Visão da Mesa)', stylePlaceholder: 'Porção de batatas ou petiscos.', aspectRatio: '1:1' }
    },
    {
        id: "espetinho",
        name: 'Espetinhos',
        description: 'Fumaça e sabor de rua.',
        icon: Flame,
        color: "from-orange-700 to-red-800",
        preset: { cameraName: 'Nikon Z8 + 85mm f/1.8', depthOfFieldName: 'Fundo Desfocado', lightingName: 'Low-Key (Luz Dramática)', angle: 'Nível do Olhar 0° (Visão Frontal)', stylePlaceholder: 'Espetinho grelhando na churrasqueira.', aspectRatio: '1:1' }
    },
    {
        id: "frango",
        name: 'Frango Fritado',
        description: 'Crocância e dourado perfeito.',
        icon: Drumstick,
        color: "from-amber-500 to-orange-600",
        preset: { cameraName: 'Canon EOS R3 + 50mm f/1.4', depthOfFieldName: 'Fundo Desfocado', lightingName: 'Luz Lateral Difusa (Janela)', angle: 'Ângulo 45° (Visão da Mesa)', stylePlaceholder: 'Frango frito crocante.', aspectRatio: '1:1' }
    },
    {
        id: "confeitaria",
        name: 'Confeitaria Fina',
        description: 'Brilho e perfeição editorial.',
        icon: Cake,
        color: "from-pink-300 to-rose-400",
        preset: { cameraName: 'Hasselblad X2D 100C + 90mm f/2.5', depthOfFieldName: 'Fundo Desfocado', lightingName: 'Backlight (Contraluz)', angle: 'Close-up/Macro (Detalhe)', stylePlaceholder: 'Bolo decorado sofisticado.', aspectRatio: '1:1' }
    }
];
