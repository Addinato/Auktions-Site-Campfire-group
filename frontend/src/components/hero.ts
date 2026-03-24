export function Hero(): HTMLElement {
    const section = document.createElement("section");

    section.className = "bg-white";

    section.innerHTML = `
        <div class="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">

            <div class="space-y-6">
                <h1 class="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-[#19323C] to-[#A93F55] bg-clip-text text-transparent">
                    Hitta exklusiva auktioner 
                </h1>

                <p class="text-gray-600 text-lg">
                    Upptäck bilar och produkter till oslagbara priser. Lägg bud i realtid och vinn din nästa drömdeal.
                </p>

                <div class="flex gap-4">
                    <a href="#productGrid"
                       class="bg-[#19323C] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#A93F55] transition">
                        Se auktioner
                    </a>

                    <button class="border border-[#19323C] text-[#19323C] px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition">
                        Om oss
                    </button>
                </div>
            </div>

            <div class="relative">
                <img 
                    src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8"
                    class="rounded-2xl shadow-lg object-cover w-full h-[350px]"
                />

                <div class="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-xl shadow text-sm">
                    Live auktioner
                </div>
            </div>

        </div>
    `;

    return section;
}