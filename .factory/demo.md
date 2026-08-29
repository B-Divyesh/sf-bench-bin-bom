# Bench Bin BOM demo

Open <https://bench-bin-bom.sociobot.in/demo/> or select **Try it with sample data** on the landing page.

The sample contains three stock records and one “Workshop weather node” build. Its four-line BOM includes an ESP32, a resistor shortage, and two M3 screw rows that share ten screws. The second screw row is therefore two short.

Demo changes use the `demo:bench-bin-bom:v1` localStorage key. Real app data uses `bench-bin-bom:v1` and is never read or written in demo mode. **Reset demo** removes only the demo key and reloads the shipped sample. **Start for real** returns to the installer landing page. The desktop app also offers **Load sample project** from its empty first-run state.

