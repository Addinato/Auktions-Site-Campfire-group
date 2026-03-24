export function Hero(): HTMLElement {
    const section = document.createElement("section");

    section.className = "bg-white";

    section.innerHTML = `
        <div class="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">

            <!-- TEXT -->
            <div class="space-y-6">
                <h1 class="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Hitta exklusiva auktioner 🚀
                </h1>

                <p class="text-gray-600 text-lg">
                    Upptäck bilar och produkter till oslagbara priser. Lägg bud i realtid och vinn din nästa drömdeal.
                </p>

                <div class="flex gap-4">
                    <a href="#productGrid"
                       class="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition">
                        Se auktioner
                    </a>

                    <button class="border px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition">
                        Om oss
                    </button>
                </div>
            </div>

            <!-- IMAGE -->
            <div class="relative">
                <img 
                    src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8"
                    class="rounded-2xl shadow-lg object-cover w-full h-[350px]"
                />

                <div class="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-xl shadow text-sm">
                    🔥 Live auktioner
                </div>
            </div>

        </div>
    `;

    return section;
}