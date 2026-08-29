# Bench Bin BOM demo

Open <https://bench-bin-bom.sociobot.in/demo/> or select **Try it with sample data** on the landing page.

The sample contains three stock records and one “Workshop weather node” build. Its four-line BOM includes an ESP32, a resistor shortage, and two M3 screw rows that share ten screws. The second screw row is therefore two short.

Demo changes use the `demo:bench-bin-bom:v1` localStorage key. Demo license data uses the separate `demo:sb_license:bench-bin-bom*` keys. Real app data and licenses are never read or written in demo mode. **Reset demo** removes all demo data and reloads the shipped sample. **Start for real** removes all demo stock, project, and license data before returning to the installer landing page. The desktop app also offers **Load sample project** from its empty first-run state.
