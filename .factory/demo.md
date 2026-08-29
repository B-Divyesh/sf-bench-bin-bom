# Bench Bin BOM demo

Open <https://bench-bin-bom.sociobot.in/demo/?demo=1> or select **Try it with sample data** on the landing page.

The sample contains three stock records and one “Workshop weather node” build. Its four-line BOM includes an ESP32, a resistor shortage, and two M3 screw rows that share ten screws. The second screw row is therefore two short.

The first demo screen shows the computed ESP32 pull location and resistor shortage. Open the full pull list to edit rows, paste CSV rows, or choose a `.csv` file from the device.

Demo changes use the `demo:bench-bin-bom:v1` localStorage key. Demo license data uses the separate `demo:sb_license:bench-bin-bom*` keys. Real app data and licenses are never read or written in demo mode. Leaving the demo by browser Back, direct navigation, tab close, or **Start for real** removes its stock, project, and license data. **Reset demo** removes all demo data and reloads the shipped sample. The desktop app also offers **Load sample project** from its empty first-run state.
