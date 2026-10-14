// Comprehensive parts data for AUAPW LLC
// Every brand's full parts list with descriptions and FAQs

export interface PartInfo {
  slug: string
  name: string
  category: string
  description: string
  longDescription: string
  benefits: string[]
  faqs: { q: string; a: string }[]
}

// Complete list of all auto parts (79 total)
export const ALL_PARTS: PartInfo[] = [
  // ─── Engines & Powertrain ───
  {
    slug: "engine",
    name: "Engine",
    category: "engines",
    description: "Complete used engines with low mileage from verified salvage yards. Gasoline, diesel, and hybrid engines available.",
    longDescription: "The engine is the heart of your vehicle. Our used engines are carefully inspected and tested before listing. We source engines from late-model vehicles with low mileage, ensuring you get a reliable powerplant at a fraction of the cost of a new one. Whether you need a 4-cylinder economy engine, a V6 for your family sedan, or a V8 for your truck or performance car, we have options from every major manufacturer.",
    benefits: ["Save 40-70% vs new", "Low mileage units available", "Tested and inspected", "30-180 day warranty included", "Free shipping nationwide"],
    faqs: [
      { q: "How many miles can a used engine last?", a: "A quality used engine with proper maintenance can last 100,000-200,000+ miles. We source engines with documented low mileage, typically 30,000-80,000 miles, giving you years of reliable service." },
      { q: "Are used engines reliable?", a: "Yes, when sourced from reputable suppliers like us. Every engine is inspected, compression tested, and verified before shipping. Our 6-month warranty gives you peace of mind." },
      { q: "How do I know if a used engine will fit my car?", a: "Our specialists verify fitment using your VIN, year, make, model, and engine size. We match OEM part numbers to ensure exact compatibility with your vehicle." },
      { q: "Is it better to buy a used or rebuilt engine?", a: "Used engines are more affordable for short-to-medium term needs. Rebuilt engines cost more but may last longer. For most drivers, a quality used engine with low mileage offers the best value." },
      { q: "What warranty do used engines come with?", a: "Our used engines come with a minimum 30-day warranty, with most covered by a standard 6-month warranty. Extended warranties up to 180 days are available on select units." },
    ],
  },
  {
    slug: "transmission",
    name: "Transmission",
    category: "transmissions",
    description: "Used automatic, manual, and CVT transmissions. All tested and inspected with warranty coverage.",
    longDescription: "Your vehicle's transmission is the second most critical component after the engine. We offer a complete range of used transmissions including automatic, manual, CVT, and dual-clutch units. Every transmission in our inventory has been tested for proper gear engagement, fluid quality, and overall operation. Our nationwide network of 2,000+ yards means we can find the exact transmission for your vehicle, often at 50-70% less than dealer prices.",
    benefits: ["Automatic, manual, CVT available", "Fluid tested before shipping", "All gears verified functional", "Up to 6-month warranty", "Exact OEM fitment guaranteed"],
    faqs: [
      { q: "How long do used transmissions last?", a: "A quality used transmission can last 100,000+ miles with proper maintenance. We source units with verified mileage and test them thoroughly before sale." },
      { q: "Is it better to buy a used or rebuilt transmission?", a: "Used transmissions are less expensive and work great for budget-conscious repairs. Rebuilt transmissions cost more but may offer longer life. Both are viable options depending on your needs and budget." },
      { q: "How can I tell if a used transmission is good?", a: "We check transmission fluid color and quality, test all gear engagements, verify there are no unusual noises, and inspect for leaks. Only transmissions that pass all tests are listed." },
      { q: "What should I look for when buying a used transmission?", a: "Key factors include mileage, fluid condition, warranty coverage, and seller reputation. Our transmissions come with full documentation and warranty protection." },
      { q: "Can you ship a used transmission to my mechanic?", a: "Absolutely! We can ship directly to your home, garage, or mechanic shop anywhere in the USA with free shipping on most orders." },
    ],
  },
  {
    slug: "transfer-case",
    name: "Transfer Case",
    category: "drivetrain",
    description: "Used transfer cases for 4WD and AWD vehicles. Tested for proper operation in all drive modes.",
    longDescription: "The transfer case is essential for 4WD and AWD vehicles, distributing power between the front and rear axles. Our used transfer cases are sourced from vehicles in excellent condition and tested for proper engagement in 2WD, 4WD High, and 4WD Low modes. We carry transfer cases for trucks, SUVs, and crossover vehicles from all major manufacturers.",
    benefits: ["All drive modes tested", "Fluid inspected", "Proper engagement verified", "OEM quality parts", "Fits trucks, SUVs, crossovers"],
    faqs: [
      { q: "What does a transfer case do?", a: "The transfer case splits engine power between the front and rear axles in 4WD and AWD vehicles. It allows you to switch between 2WD and 4WD modes." },
      { q: "How do I know if my transfer case is bad?", a: "Signs include difficulty shifting between drive modes, grinding noises, fluid leaks under the vehicle, or dashboard warning lights for the 4WD system." },
      { q: "How much does a used transfer case cost?", a: "Used transfer cases typically range from $400-$1,500 depending on the vehicle make and model. This is significantly less than the $2,000-$4,000 cost of a new unit." },
    ],
  },
  // ─── ABS & Braking ───
  {
    slug: "abs",
    name: "ABS",
    category: "brakes",
    description: "Complete Anti-Lock Braking System units. OEM quality for safe, reliable braking performance.",
    longDescription: "The Anti-Lock Braking System (ABS) is a critical safety component that prevents wheel lockup during hard braking. Our used ABS units include the hydraulic control unit, electronic control module, and associated sensors. Every unit is tested for proper function and verified against your vehicle's OEM specifications.",
    benefits: ["Complete ABS units", "Safety tested", "OEM specifications", "Plug-and-play installation", "Critical safety component"],
    faqs: [
      { q: "What is an ABS system?", a: "ABS (Anti-Lock Braking System) prevents your wheels from locking up during emergency braking, allowing you to maintain steering control. It's a critical safety feature found in all modern vehicles." },
      { q: "Can I drive without ABS?", a: "While technically possible, driving without a functioning ABS is unsafe and may fail state inspections. ABS significantly reduces stopping distances and prevents skidding." },
      { q: "How much does a used ABS unit cost?", a: "Used ABS units typically cost $150-$600 depending on the vehicle, compared to $800-$2,000+ for new dealer parts." },
    ],
  },
  {
    slug: "abs-pump",
    name: "ABS Pump",
    category: "brakes",
    description: "Used ABS hydraulic pumps for all makes. Tested for pressure and proper modulation.",
    longDescription: "The ABS pump is the hydraulic heart of your anti-lock braking system. It rapidly modulates brake pressure to prevent wheel lockup during hard braking. Our used ABS pumps are pressure-tested and verified for proper operation before shipping.",
    benefits: ["Pressure tested", "Verified modulation", "All makes available", "OEM quality", "Quick shipping"],
    faqs: [
      { q: "What does an ABS pump do?", a: "The ABS pump rapidly increases and decreases brake pressure to individual wheels during hard braking, preventing wheel lockup and maintaining steering control." },
      { q: "How do I know if my ABS pump is failing?", a: "Warning signs include the ABS light on your dashboard, pulsating brake pedal during normal braking, or unusual buzzing noises from the brake system." },
    ],
  },
  // ─── AC & Climate ───
  {
    slug: "ac-compressor",
    name: "AC Compressor",
    category: "cooling",
    description: "Used AC compressors for all vehicle makes. Tested for proper refrigerant compression and cooling.",
    longDescription: "The AC compressor is the pump that circulates refrigerant through your vehicle's air conditioning system. Our used AC compressors are tested for proper rotation, clutch engagement, and compression. We carry compressors for all major makes and models, ensuring your vehicle stays cool during hot weather.",
    benefits: ["Clutch engagement tested", "Compression verified", "All refrigerant types", "Saves 50-70% vs new", "All makes and models"],
    faqs: [
      { q: "How long does a used AC compressor last?", a: "A quality used AC compressor can last 50,000-100,000+ miles. Our units are tested before shipping and come with warranty coverage." },
      { q: "Why is my AC not blowing cold air?", a: "Common causes include a failed AC compressor, low refrigerant levels, a clogged condenser, or a faulty expansion valve. A mechanic can diagnose the exact issue." },
      { q: "Can I install a used AC compressor myself?", a: "AC compressor replacement requires specialized tools and refrigerant handling. We recommend professional installation by a certified mechanic." },
    ],
  },
  {
    slug: "ac-condenser",
    name: "AC Condenser",
    category: "cooling",
    description: "Used AC condensers in excellent condition. Leak-tested and ready for installation.",
    longDescription: "The AC condenser sits in front of your radiator and converts high-pressure refrigerant gas into liquid. Our used AC condensers are inspected for damage, leak-tested, and verified for proper fin condition to ensure maximum cooling efficiency.",
    benefits: ["Leak tested", "No fin damage", "All vehicle types", "Easy installation", "Affordable pricing"],
    faqs: [
      { q: "What does an AC condenser do?", a: "The condenser converts hot, high-pressure refrigerant gas from the compressor into a cooled liquid before it enters the evaporator inside your vehicle's cabin." },
      { q: "How do I know if my AC condenser is bad?", a: "Signs include warm air from vents, refrigerant leaks near the front of the vehicle, or visible damage to the condenser fins." },
    ],
  },
  {
    slug: "ac-evaporator",
    name: "AC Evaporator",
    category: "cooling",
    description: "Used AC evaporator cores. Tested for leaks and proper cooling performance.",
    longDescription: "The AC evaporator is located inside your vehicle's dashboard and is responsible for cooling the cabin air. Our used evaporators are leak-tested and inspected for proper operation. Replacing a bad evaporator with a quality used unit can save you hundreds versus dealer prices.",
    benefits: ["Leak free guaranteed", "Proper cooling verified", "Clean and inspected", "Major cost savings", "All vehicle makes"],
    faqs: [
      { q: "Where is the AC evaporator located?", a: "The evaporator is inside your vehicle's dashboard, behind the glove box or center console. It cools the air before it enters the cabin." },
      { q: "How much does it cost to replace an AC evaporator?", a: "A used evaporator costs $100-$400 vs $500-$1,500 for a new one. Labor costs are similar either way since dashboard disassembly is required." },
    ],
  },
  // ─── Sensors & Electronics ───
  {
    slug: "air-flow-meter",
    name: "Air Flow Meter",
    category: "electrical",
    description: "Used mass air flow (MAF) sensors. Tested for accurate readings and proper voltage output.",
    longDescription: "The air flow meter (also called mass air flow sensor or MAF sensor) measures the amount of air entering your engine, which the computer uses to calculate proper fuel injection. Our used MAF sensors are tested for accurate readings and proper voltage output to ensure optimal engine performance and fuel economy.",
    benefits: ["Tested for accuracy", "Proper voltage output", "Improves fuel economy", "Restores engine performance", "OEM specifications"],
    faqs: [
      { q: "What happens when a MAF sensor fails?", a: "A failed MAF sensor can cause poor fuel economy, rough idle, stalling, hesitation during acceleration, and check engine lights." },
      { q: "Can I clean my MAF sensor instead of replacing it?", a: "Sometimes cleaning with MAF sensor cleaner spray can restore function, but if the sensor element is damaged, replacement is necessary." },
    ],
  },
  {
    slug: "anti-lock-braking-system",
    name: "Anti Lock Braking System",
    category: "brakes",
    description: "Complete ABS modules including hydraulic unit and electronic controller. Safety tested.",
    longDescription: "Our complete Anti-Lock Braking System modules include both the hydraulic modulator and electronic control unit. These integrated units are the most common replacement configuration and provide reliable ABS function for your vehicle.",
    benefits: ["Complete module included", "Hydraulic + electronic", "Safety verified", "Plug-and-play design", "All makes available"],
    faqs: [
      { q: "What is included in an ABS module?", a: "A complete ABS module includes the hydraulic control unit (HCU) that modulates brake pressure and the electronic control module (ECM) that processes wheel speed sensor data." },
      { q: "How much does a used ABS module cost?", a: "Used ABS modules range from $200-$800 depending on the vehicle, compared to $1,000-$3,000+ for new dealer parts." },
    ],
  },
  // ─── Axles & Drivetrain ───
  {
    slug: "axle-assembly-front",
    name: "Axle Assembly Front",
    category: "drivetrain",
    description: "Complete front axle assemblies including CV joints and boots. Ready to install.",
    longDescription: "Our used front axle assemblies come complete with CV joints, boots, and hardware. Each assembly is inspected for wear, checked for clicking or vibration, and verified for proper spline engagement. We carry front axle assemblies for FWD, AWD, and 4WD vehicles.",
    benefits: ["Complete assembly", "CV joints included", "Inspected for wear", "All drive types", "Ready to install"],
    faqs: [
      { q: "How do I know if my front axle is bad?", a: "Common signs include clicking or popping sounds during turns, vibration while driving, grease leaking from torn CV boots, or visible damage to the axle shaft." },
      { q: "Can I drive with a bad front axle?", a: "Driving with a severely damaged front axle is dangerous and can cause loss of control. If you hear clicking or notice vibration, get it inspected promptly." },
    ],
  },
  {
    slug: "axle-assembly-rear",
    name: "Axle Assembly Rear",
    category: "drivetrain",
    description: "Complete rear axle assemblies with differential. Inspected and ready for installation.",
    longDescription: "Our rear axle assemblies include the axle housing, differential, axle shafts, and bearings. These complete units are sourced from low-mileage vehicles and inspected for proper bearing operation, gear mesh, and seal integrity.",
    benefits: ["Differential included", "Bearings inspected", "Seals checked", "Low mileage units", "Complete hardware"],
    faqs: [
      { q: "What is included in a rear axle assembly?", a: "A complete rear axle assembly includes the axle housing, differential, ring and pinion gears, axle shafts, bearings, and seals." },
      { q: "How much does a used rear axle assembly cost?", a: "Used rear axle assemblies range from $500-$2,000 depending on vehicle type, compared to $3,000-$6,000+ for new units." },
    ],
  },
  {
    slug: "axle-beam",
    name: "Axle Beam",
    category: "drivetrain",
    description: "Used axle beams for trucks and SUVs. Inspected for straightness and structural integrity.",
    longDescription: "The axle beam is the structural backbone of your vehicle's axle assembly. Our used axle beams are inspected for straightness, cracks, and corrosion. We carry solid axle beams for trucks and SUVs as well as torsion beam axles for compact vehicles.",
    benefits: ["Structural integrity verified", "No cracks or bends", "Trucks and SUVs", "All major makes", "Cost effective repair"],
    faqs: [
      { q: "When does an axle beam need replacement?", a: "Axle beams may need replacement after severe impacts, accidents, or when corrosion has compromised structural integrity." },
    ],
  },
  {
    slug: "axle-shaft",
    name: "Axle Shaft",
    category: "drivetrain",
    description: "Used axle shafts for all vehicle types. Splines inspected and bearing surfaces verified.",
    longDescription: "Axle shafts transfer power from the differential to the wheels. Our used axle shafts are inspected for worn splines, damaged bearing surfaces, and bent shafts. We carry half-shafts, full-floating axle shafts, and stub shafts for all makes and models.",
    benefits: ["Splines inspected", "Bearing surfaces checked", "All shaft types", "Matched to your vehicle", "Affordable replacement"],
    faqs: [
      { q: "What causes axle shaft failure?", a: "Axle shafts can fail from excessive load, worn bearings, improper lubrication, or impact damage from hitting road hazards." },
      { q: "How much does a used axle shaft cost?", a: "Used axle shafts typically cost $75-$400 depending on vehicle type, compared to $200-$800 for new parts." },
    ],
  },
  // ─── Engine Components ───
  {
    slug: "bell-housing",
    name: "Bell Housing",
    category: "transmissions",
    description: "Used bell housings connecting engine to transmission. Inspected for cracks and proper alignment.",
    longDescription: "The bell housing connects your engine to the transmission and houses the clutch assembly or torque converter. Our used bell housings are inspected for cracks, bolt hole integrity, and proper alignment surfaces. Getting a quality used bell housing can save you significant money on transmission-related repairs.",
    benefits: ["Crack-free guaranteed", "Proper alignment verified", "All engine/trans combos", "Hardware included when available", "Major cost savings"],
    faqs: [
      { q: "What does a bell housing do?", a: "The bell housing is the structural connection between your engine and transmission. It houses the clutch (manual) or torque converter (automatic) and maintains proper alignment." },
    ],
  },
  {
    slug: "blower-motor",
    name: "Blower Motor",
    category: "cooling",
    description: "Used HVAC blower motors for all vehicles. Tested for proper speed operation on all settings.",
    longDescription: "The blower motor pushes air through your vehicle's heating and air conditioning system. Our used blower motors are tested on all speed settings to ensure proper airflow. We carry blower motors for all makes and models, helping you restore cabin comfort affordably.",
    benefits: ["All speeds tested", "Quiet operation verified", "All makes available", "Easy installation", "Restores cabin comfort"],
    faqs: [
      { q: "Why is my blower motor not working?", a: "Common causes include a burned-out motor, failed blower motor resistor, blown fuse, or faulty HVAC control module." },
      { q: "How much does a used blower motor cost?", a: "Used blower motors cost $30-$150 compared to $100-$400 for new OEM parts." },
    ],
  },
  {
    slug: "carrier-assembly",
    name: "Carrier Assembly",
    category: "drivetrain",
    description: "Used differential carrier assemblies. Gear mesh and bearing condition verified.",
    longDescription: "The carrier assembly is the core of your differential, containing the ring and pinion gears, side gears, and spider gears. Our used carrier assemblies are inspected for proper gear mesh patterns, bearing condition, and preload specifications.",
    benefits: ["Gear mesh verified", "Bearings inspected", "Proper preload", "All gear ratios", "Trucks and cars"],
    faqs: [
      { q: "What is a carrier assembly?", a: "The carrier assembly houses the differential gears that allow your wheels to rotate at different speeds during turns while transmitting power from the driveshaft." },
    ],
  },
  {
    slug: "clutch-master-cylinder",
    name: "Clutch Master Cylinder",
    category: "transmissions",
    description: "Used clutch master cylinders for manual transmission vehicles. Tested for pressure and seal integrity.",
    longDescription: "The clutch master cylinder converts the force from your clutch pedal into hydraulic pressure to disengage the clutch. Our used clutch master cylinders are tested for proper pressure output and seal integrity to ensure smooth clutch engagement.",
    benefits: ["Pressure tested", "Seals verified", "Smooth operation", "Manual trans vehicles", "OEM quality"],
    faqs: [
      { q: "How do I know if my clutch master cylinder is bad?", a: "Signs include a soft or spongy clutch pedal, difficulty shifting gears, clutch fluid leaks near the firewall, or the clutch pedal sinking to the floor." },
    ],
  },
  {
    slug: "column-switch",
    name: "Column Switch",
    category: "electrical",
    description: "Used steering column switches for turn signals, wipers, and lighting controls.",
    longDescription: "Steering column switches (also called combination switches or multi-function switches) control your turn signals, headlights, windshield wipers, and cruise control. Our used column switches are tested for all functions and verified for proper electrical connectivity.",
    benefits: ["All functions tested", "Electrical connections verified", "Turn signals/wipers/lights", "OEM fit guaranteed", "Affordable replacement"],
    faqs: [
      { q: "What functions does a column switch control?", a: "Depending on your vehicle, the column switch may control turn signals, headlights, high beams, fog lights, windshield wipers, washers, and cruise control." },
    ],
  },
  // ─── Suspension ───
  {
    slug: "control-arm-front",
    name: "Control Arm Front",
    category: "suspension",
    description: "Used front control arms with bushings. Inspected for wear and proper alignment geometry.",
    longDescription: "Front control arms connect the steering knuckle to the vehicle frame and are critical for proper wheel alignment and handling. Our used front control arms are inspected for bushing condition, ball joint wear, and structural integrity to ensure safe, predictable handling.",
    benefits: ["Bushings inspected", "Ball joints checked", "Proper geometry", "Restores handling", "All vehicle types"],
    faqs: [
      { q: "How do I know if my control arm is worn?", a: "Signs include clunking noises over bumps, uneven tire wear, steering wheel vibration, and the vehicle pulling to one side." },
      { q: "Should I replace both control arms at once?", a: "It's recommended to replace control arms in pairs to maintain balanced handling and alignment. Both sides wear at similar rates." },
    ],
  },
  {
    slug: "control-arm-rear",
    name: "Control Arm Rear",
    category: "suspension",
    description: "Used rear control arms for all vehicle types. Bushings and mounting points inspected.",
    longDescription: "Rear control arms maintain proper rear wheel alignment and absorb road impacts. Our used rear control arms are inspected for bushing wear, mounting point integrity, and structural condition to ensure safe rear suspension operation.",
    benefits: ["Bushings inspected", "Mounting points verified", "Proper alignment", "All makes and models", "Affordable repair option"],
    faqs: [
      { q: "What do rear control arms do?", a: "Rear control arms connect the rear wheels to the vehicle body, maintaining proper wheel alignment and allowing the suspension to absorb road impacts." },
    ],
  },
  {
    slug: "convertible-top-motor",
    name: "Convertible Top Motor",
    category: "electrical",
    description: "Used convertible top motors and hydraulic pumps. Tested for proper operation in both directions.",
    longDescription: "Convertible top motors power the raising and lowering of your convertible soft or hard top. Our used motors are tested for proper operation in both directions, including hydraulic pump pressure and cylinder operation for hydraulic tops.",
    benefits: ["Both directions tested", "Hydraulic pressure verified", "All convertible models", "Motor and pump available", "Saves significantly vs new"],
    faqs: [
      { q: "Why won't my convertible top go up or down?", a: "Common causes include a failed motor, low hydraulic fluid, damaged cylinders, or electrical issues with switches or relays." },
    ],
  },
  {
    slug: "cylinder-head",
    name: "Cylinder Head",
    category: "engines",
    description: "Used cylinder heads for all engine types. Pressure tested and inspected for cracks or warping.",
    longDescription: "The cylinder head sits atop the engine block and contains the valves, camshafts, and combustion chambers. Our used cylinder heads are pressure tested for cracks, checked for warping with a straightedge, and inspected for valve and seat condition. We carry cylinder heads for inline, V6, V8, and other engine configurations.",
    benefits: ["Pressure tested for cracks", "Checked for warping", "Valves inspected", "All engine types", "Tested and verified"],
    faqs: [
      { q: "What causes a cylinder head to crack?", a: "Overheating is the most common cause of cracked cylinder heads. Other causes include manufacturing defects, detonation, or head bolt failure." },
      { q: "Can a cracked cylinder head be repaired?", a: "Some cracks can be welded or repaired, but replacement with a quality used head is often more reliable and cost-effective." },
    ],
  },
  // ─── Differential ───
  {
    slug: "differential-assembly",
    name: "Differential Assembly",
    category: "drivetrain",
    description: "Complete used differential assemblies. Gear mesh, bearing condition, and backlash verified.",
    longDescription: "The differential allows your drive wheels to rotate at different speeds during turns while transmitting power from the driveshaft. Our used differential assemblies include the housing, ring and pinion gears, side gears, and bearings. Each unit is inspected for proper gear mesh, bearing condition, and backlash specifications.",
    benefits: ["Complete assemblies", "Gear mesh verified", "Bearings inspected", "Proper backlash", "All gear ratios available"],
    faqs: [
      { q: "What does a differential do?", a: "The differential splits engine torque between the drive wheels, allowing the outside wheel to rotate faster than the inside wheel during turns for smooth cornering." },
      { q: "How do I know if my differential is going bad?", a: "Warning signs include whining or humming noises that change with speed, clunking during acceleration, or fluid leaks from the differential housing." },
    ],
  },
  // ─── Drive Shafts ───
  {
    slug: "drive-shaft-front",
    name: "Drive Shaft Front",
    category: "drivetrain",
    description: "Used front drive shafts for AWD and 4WD vehicles. U-joints and CV joints inspected.",
    longDescription: "Front drive shafts transfer power from the transfer case to the front differential in AWD and 4WD vehicles. Our used front drive shafts are inspected for U-joint condition, CV joint operation, and shaft straightness.",
    benefits: ["U-joints inspected", "CV joints checked", "Shaft straightness verified", "AWD and 4WD vehicles", "All makes and models"],
    faqs: [
      { q: "How do I know if my front drive shaft is bad?", a: "Symptoms include vibration at certain speeds, clunking sounds during acceleration or deceleration, and squeaking or grinding noises from U-joints." },
    ],
  },
  {
    slug: "drive-shaft-rear",
    name: "Drive Shaft Rear",
    category: "drivetrain",
    description: "Used rear drive shafts for RWD, AWD, and 4WD vehicles. Balanced and inspected.",
    longDescription: "Rear drive shafts connect the transmission or transfer case to the rear differential. Our used rear drive shafts are inspected for U-joint condition, balance, and straightness. We carry one-piece and two-piece drive shafts for all vehicle configurations.",
    benefits: ["Balance verified", "U-joints inspected", "One and two-piece", "All drive configurations", "Proper length guaranteed"],
    faqs: [
      { q: "What causes drive shaft vibration?", a: "Common causes include worn U-joints, an out-of-balance shaft, worn center support bearings (two-piece shafts), or a bent shaft from road hazard impact." },
    ],
  },
  // ─── Electrical Components ───
  {
    slug: "electric-door-motor",
    name: "Electric Door Motor",
    category: "electrical",
    description: "Used electric door lock and window motors. Tested for proper operation in both directions.",
    longDescription: "Electric door motors power your power door locks and window regulators. Our used door motors are tested for proper operation in both up/down or lock/unlock directions. We carry motors for all door positions and vehicle makes.",
    benefits: ["Both directions tested", "All door positions", "All vehicle makes", "Easy installation", "Affordable replacement"],
    faqs: [
      { q: "Why is my power door lock not working?", a: "Common causes include a failed door lock actuator motor, broken wiring, blown fuse, or faulty door lock switch." },
    ],
  },
  {
    slug: "exhaust-manifold",
    name: "Exhaust Manifold",
    category: "engines",
    description: "Used exhaust manifolds for all engine types. Inspected for cracks, warping, and bolt integrity.",
    longDescription: "The exhaust manifold collects exhaust gases from the engine cylinders and channels them to the exhaust system. Our used exhaust manifolds are inspected for cracks, warping, broken studs, and corrosion. We carry cast iron and stainless steel manifolds for all engine configurations.",
    benefits: ["Crack-free guaranteed", "No warping", "All engine types", "Cast iron and steel", "Studs inspected"],
    faqs: [
      { q: "What are signs of a cracked exhaust manifold?", a: "Signs include a ticking noise during cold starts, exhaust smell in the engine bay, decreased fuel economy, and visible exhaust leaks." },
      { q: "Can I drive with a cracked exhaust manifold?", a: "While possible short-term, a cracked manifold can cause exhaust fumes to enter the cabin, poor engine performance, and may damage oxygen sensors or catalytic converters." },
    ],
  },
  {
    slug: "fan-blade",
    name: "Fan Blade",
    category: "cooling",
    description: "Used engine cooling fan blades and assemblies. Inspected for balance and blade condition.",
    longDescription: "Cooling fan blades draw air through the radiator to maintain proper engine temperature. Our used fan blades are inspected for cracked or missing blades, proper balance, and mounting hub condition. We carry both mechanical (belt-driven) and electric cooling fan assemblies.",
    benefits: ["Balance verified", "No cracked blades", "Mechanical and electric", "Fan clutch available", "All vehicle types"],
    faqs: [
      { q: "How do I know if my cooling fan is bad?", a: "Signs include engine overheating at idle or in traffic, the fan not spinning when the engine is hot, or loud grinding/squealing from the fan area." },
    ],
  },
  {
    slug: "flywheel",
    name: "Flywheel",
    category: "engines",
    description: "Used flywheels for manual transmission vehicles. Surface inspected and heat-check verified.",
    longDescription: "The flywheel connects the engine crankshaft to the clutch assembly in manual transmission vehicles. Our used flywheels are inspected for surface condition, heat checking, hot spots, and ring gear tooth condition. We also carry dual-mass flywheels for vehicles that require them.",
    benefits: ["Surface condition verified", "No heat damage", "Ring gear inspected", "Standard and dual-mass", "Proper weight balance"],
    faqs: [
      { q: "Should I replace the flywheel when replacing the clutch?", a: "If the flywheel shows heat discoloration, scoring, or hot spots, it should be resurfaced or replaced. For dual-mass flywheels, replacement is recommended with every clutch change." },
      { q: "What is a dual-mass flywheel?", a: "A dual-mass flywheel uses springs and dampeners to absorb engine vibration. They provide smoother engagement but are more expensive to replace than solid flywheels." },
    ],
  },
  {
    slug: "fuel-pump",
    name: "Fuel Pump",
    category: "engines",
    description: "Used fuel pumps for all vehicles. Tested for proper pressure output and flow rate.",
    longDescription: "The fuel pump delivers gasoline from the tank to the engine at the proper pressure and flow rate. Our used fuel pumps are tested for output pressure, flow rate, and electrical operation. We carry in-tank, in-line, and high-pressure direct injection fuel pumps.",
    benefits: ["Pressure tested", "Flow rate verified", "All pump types", "In-tank and external", "OEM specifications"],
    faqs: [
      { q: "What are signs of a failing fuel pump?", a: "Signs include difficulty starting, engine sputtering at high speeds, loss of power under load, whining noise from the fuel tank, and engine stalling." },
      { q: "How long does a fuel pump last?", a: "Fuel pumps typically last 100,000+ miles. Running the tank low on fuel frequently can reduce pump lifespan since fuel helps cool the pump motor." },
    ],
  },
  {
    slug: "gps-screen",
    name: "GPS Screen",
    category: "electrical",
    description: "Used factory GPS navigation screens and head units. Tested for display and touch function.",
    longDescription: "Factory GPS navigation screens and head units provide integrated navigation, audio, and vehicle settings control. Our used GPS screens are tested for display clarity, touch responsiveness, and all connected functions including audio, climate controls, and backup camera.",
    benefits: ["Display tested", "Touch function verified", "Audio system included", "Factory integration", "Camera compatible"],
    faqs: [
      { q: "Will a used GPS screen work with my car?", a: "We match GPS screens by exact year, make, model, and trim level to ensure full compatibility with your vehicle's factory systems." },
      { q: "Do used GPS screens include map updates?", a: "Maps may be outdated on used units. Most systems can be updated through the manufacturer's website or a dealer visit." },
    ],
  },
  {
    slug: "heater-controls",
    name: "Heater Controls",
    category: "cooling",
    description: "Used HVAC heater control modules and panels. All functions tested including temperature and fan speed.",
    longDescription: "Heater control modules and panels manage your vehicle's heating, ventilation, and air conditioning settings. Our used heater controls are tested for all functions including temperature adjustment, fan speed selection, mode selection, and dual-zone operation where applicable.",
    benefits: ["All functions tested", "Temperature control verified", "Fan speed operation", "Dual-zone when available", "Easy installation"],
    faqs: [
      { q: "Why is my heater control not working?", a: "Common causes include a failed control module, broken blend door actuator, faulty temperature sensor, or wiring issues." },
    ],
  },
  {
    slug: "intake-manifold",
    name: "Intake Manifold",
    category: "engines",
    description: "Used intake manifolds for all engine types. Inspected for cracks, vacuum leaks, and port condition.",
    longDescription: "The intake manifold distributes air (and in some cases fuel) evenly to each engine cylinder. Our used intake manifolds are inspected for cracks, vacuum leak potential, port condition, and gasket surface integrity. We carry both plastic and aluminum manifolds.",
    benefits: ["No cracks or leaks", "Port condition verified", "Gasket surfaces checked", "Plastic and aluminum", "All engine configurations"],
    faqs: [
      { q: "Can a plastic intake manifold crack?", a: "Yes, plastic intake manifolds can crack from heat cycling and age. Symptoms include rough idle, vacuum leaks, and check engine lights." },
      { q: "What happens if the intake manifold gasket fails?", a: "A failed intake manifold gasket can cause vacuum leaks, rough idle, coolant leaks (on some engines), poor fuel economy, and misfires." },
    ],
  },
  {
    slug: "oil-pan-engine",
    name: "Oil Pan Engine",
    category: "engines",
    description: "Used engine oil pans. Inspected for damage, corrosion, and drain plug thread condition.",
    longDescription: "The engine oil pan holds the engine oil supply and provides a mounting point for the oil pump pickup tube. Our used oil pans are inspected for dents, cracks, corrosion, and drain plug thread condition. We carry steel and aluminum oil pans for all engine types.",
    benefits: ["No dents or cracks", "Drain plug threads verified", "No corrosion", "Steel and aluminum", "Baffle included when OEM"],
    faqs: [
      { q: "Can a dented oil pan cause problems?", a: "Yes, a severely dented oil pan can restrict the oil pump pickup tube, causing oil starvation and potential engine damage." },
    ],
  },
  {
    slug: "power-brake-booster",
    name: "Power Brake Booster",
    category: "brakes",
    description: "Used power brake boosters. Vacuum tested for proper assist and diaphragm integrity.",
    longDescription: "The power brake booster amplifies the force from your brake pedal using engine vacuum or hydraulic pressure. Our used brake boosters are vacuum tested for proper assist, checked for diaphragm integrity, and verified for no internal leaks.",
    benefits: ["Vacuum tested", "Diaphragm integrity verified", "Proper assist confirmed", "All vehicle types", "Includes hardware when available"],
    faqs: [
      { q: "How do I know if my brake booster is bad?", a: "Signs include a hard brake pedal, longer stopping distances, hissing noise when pressing the brake pedal, and the engine RPM changing when braking." },
      { q: "Is it safe to drive with a bad brake booster?", a: "Driving with a failed brake booster is unsafe as it significantly increases the pedal effort needed to stop. The brakes still work but require much more force." },
    ],
  },
  {
    slug: "rear-knuckle",
    name: "Rear Knuckle",
    category: "suspension",
    description: "Used rear steering knuckles/spindles. Inspected for cracks, bearing seat, and mounting integrity.",
    longDescription: "The rear knuckle (or rear spindle) holds the rear wheel bearing and provides mounting points for suspension components. Our used rear knuckles are inspected for cracks, bearing seat condition, and mounting point integrity.",
    benefits: ["No cracks", "Bearing seat inspected", "Mounting points verified", "All vehicle types", "Hub bearing available"],
    faqs: [
      { q: "When does a rear knuckle need replacement?", a: "Rear knuckles typically need replacement after accident damage, when bearing seats are worn beyond specification, or when mounting points are damaged." },
    ],
  },
  {
    slug: "speedometer",
    name: "Speedometer",
    category: "electrical",
    description: "Used speedometer clusters and instrument panels. Tested for gauge accuracy and warning lights.",
    longDescription: "Speedometer clusters (instrument clusters) display vehicle speed, engine RPM, fuel level, temperature, and warning indicators. Our used clusters are tested for gauge operation, backlight function, and warning light verification. We can source clusters with specific mileage ranges upon request.",
    benefits: ["All gauges tested", "Backlights verified", "Warning lights functional", "Mileage documented", "OEM specifications"],
    faqs: [
      { q: "Will a used speedometer cluster show the correct mileage?", a: "Used clusters display their original mileage. Your mechanic or dealer can reprogram the correct mileage in most modern vehicles. The vehicle's actual mileage is stored in the ECU." },
    ],
  },
  {
    slug: "spindle",
    name: "Spindle",
    category: "suspension",
    description: "Used spindles/steering knuckles. Inspected for bearing surfaces, mounting points, and structural integrity.",
    longDescription: "The spindle (steering knuckle) is the pivot point for your front wheels, housing the wheel bearing and providing mounting for brake components, tie rods, and control arms. Our used spindles are inspected for bearing surface condition, caliper mounting integrity, and structural soundness.",
    benefits: ["Bearing surfaces verified", "Caliper mounts intact", "No structural damage", "All mounting points checked", "Front and rear available"],
    faqs: [
      { q: "What does a spindle do?", a: "The spindle provides the pivot point for steering, mounts the wheel bearing, and provides attachment points for brake calipers, tie rods, and control arms." },
    ],
  },
  {
    slug: "steering-column",
    name: "Steering Column",
    category: "suspension",
    description: "Used steering columns with all switches and controls. Tilt and telescoping function verified.",
    longDescription: "The steering column connects the steering wheel to the steering gear and houses the ignition switch, turn signal controls, and other driver inputs. Our used steering columns are tested for smooth rotation, tilt/telescoping function where applicable, and proper lock mechanism operation.",
    benefits: ["Smooth rotation", "Tilt/telescope tested", "Switches included", "Lock mechanism verified", "All vehicle types"],
    faqs: [
      { q: "Can a steering column be repaired?", a: "Some issues like worn bearings or broken switches can be repaired. However, crashed or severely worn columns should be replaced entirely for safety." },
    ],
  },
  {
    slug: "steering-rack",
    name: "Steering Rack",
    category: "suspension",
    description: "Used power steering racks. Tested for smooth operation, proper assist, and no leaks.",
    longDescription: "The steering rack converts the rotational motion of the steering wheel into the linear motion needed to turn the front wheels. Our used steering racks are tested for smooth operation, proper power assist, seal integrity, and inner tie rod condition. We carry hydraulic and electric power steering racks.",
    benefits: ["Smooth operation", "No leaks", "Power assist verified", "Inner tie rods checked", "Hydraulic and electric"],
    faqs: [
      { q: "What are signs of a bad steering rack?", a: "Signs include difficulty steering, power steering fluid leaks, clunking during turns, excessive play in the steering wheel, and uneven tire wear." },
      { q: "How much does a used steering rack cost?", a: "Used steering racks typically cost $150-$600 depending on the vehicle, compared to $400-$1,500+ for new or remanufactured units." },
    ],
  },
  {
    slug: "strut",
    name: "Strut",
    category: "suspension",
    description: "Used strut assemblies including spring and mount. Tested for proper damping and no leaks.",
    longDescription: "Strut assemblies combine the shock absorber, coil spring, and upper mount into one integrated unit. Our used struts are tested for proper damping force, checked for oil leaks, and inspected for spring condition and upper mount bearing operation.",
    benefits: ["Damping tested", "No leaks", "Spring included", "Upper mount bearing checked", "Complete assemblies"],
    faqs: [
      { q: "How do I know if my struts are worn?", a: "Signs include excessive bouncing, nose-diving during braking, poor handling, uneven tire wear, oil leaking from the strut body, and knocking sounds over bumps." },
      { q: "Should I replace struts in pairs?", a: "Yes, struts should always be replaced in pairs (both fronts or both rears) to maintain balanced handling and ride quality." },
    ],
  },
  {
    slug: "throttle-body",
    name: "Throttle Body",
    category: "engines",
    description: "Used throttle bodies with TPS sensor. Tested for proper butterfly valve operation and idle control.",
    longDescription: "The throttle body controls the amount of air entering the engine based on accelerator pedal input. Our used throttle bodies are tested for smooth butterfly valve operation, proper TPS (Throttle Position Sensor) voltage output, and idle air control function.",
    benefits: ["Butterfly valve tested", "TPS sensor verified", "Idle control checked", "Drive-by-wire compatible", "OEM specifications"],
    faqs: [
      { q: "What happens when a throttle body goes bad?", a: "Symptoms include rough idle, poor acceleration response, stalling, check engine light, and the engine entering limp mode (reduced power)." },
    ],
  },
  {
    slug: "timing-cover",
    name: "Timing Cover",
    category: "engines",
    description: "Used timing covers for all engine types. Inspected for cracks, seal surfaces, and bolt integrity.",
    longDescription: "The timing cover protects the timing chain or belt and associated components from debris and retains engine oil. Our used timing covers are inspected for cracks, seal surface condition, bolt hole integrity, and proper gasket mating surfaces.",
    benefits: ["No cracks", "Seal surfaces verified", "Gasket surfaces checked", "All engine types", "Hardware included when available"],
    faqs: [
      { q: "Why is my timing cover leaking oil?", a: "Timing cover oil leaks are usually caused by a worn gasket or seal, cracked cover, or loose bolts. Replacement of the gasket and seal can often fix the issue." },
    ],
  },
  {
    slug: "torsion-bar",
    name: "Torsion Bar",
    category: "suspension",
    description: "Used torsion bars for trucks and older vehicles. Inspected for straightness and proper spring rate.",
    longDescription: "Torsion bars are a type of spring used in the front suspension of trucks and some older vehicles. They provide suspension travel by twisting along their length. Our used torsion bars are inspected for straightness, proper spring rate, and spline condition.",
    benefits: ["Straightness verified", "Spring rate maintained", "Splines inspected", "Trucks and SUVs", "Left and right available"],
    faqs: [
      { q: "What vehicles use torsion bar suspension?", a: "Torsion bars are commonly found on trucks like the Chevrolet Silverado, GMC Sierra, Toyota Tacoma, and older SUVs. Some vintage cars also used torsion bars." },
    ],
  },
  {
    slug: "turbo-charger",
    name: "Turbo Charger",
    category: "engines",
    description: "Used turbochargers for all vehicle makes. Shaft play and compressor wheel condition verified.",
    longDescription: "Turbochargers use exhaust gas energy to compress intake air, dramatically increasing engine power output. Our used turbochargers are inspected for shaft play (radial and axial), compressor and turbine wheel condition, housing integrity, and wastegate operation.",
    benefits: ["Shaft play measured", "Wheel condition verified", "Wastegate tested", "All makes and models", "Significant cost savings"],
    faqs: [
      { q: "How do I know if my turbo is failing?", a: "Signs include loss of power, excessive smoke from the exhaust, whining or siren-like sounds, check engine light, and oil leaks from the turbo." },
      { q: "How much does a used turbocharger cost?", a: "Used turbochargers range from $300-$1,500 depending on the vehicle, compared to $1,000-$4,000+ for new OEM turbos." },
    ],
  },
  // ─── Window & Body ───
  {
    slug: "window-regulator-front",
    name: "Window Regulator Front",
    category: "body",
    description: "Used front window regulators with motor. Tested for smooth up/down operation.",
    longDescription: "Front window regulators raise and lower your front door windows. Our used window regulators come with the motor attached and are tested for smooth operation in both directions. We carry regulators for both driver and passenger side doors.",
    benefits: ["Motor included", "Smooth operation tested", "Both directions verified", "Driver and passenger", "All vehicle makes"],
    faqs: [
      { q: "Why is my power window not going up?", a: "Common causes include a failed window regulator, burned-out motor, broken cables or gears, faulty switch, or blown fuse." },
    ],
  },
  {
    slug: "window-regulator-quarter",
    name: "Window Regulator Quarter",
    category: "body",
    description: "Used quarter panel window regulators. Tested for proper operation on vehicles with rear quarter windows.",
    longDescription: "Quarter panel window regulators operate the small windows behind the rear doors on some vehicle styles. Our used quarter window regulators are tested for proper operation and come with the motor when applicable.",
    benefits: ["Motor included when applicable", "Tested operation", "Specific to quarter panel", "All vehicle styles", "Affordable replacement"],
    faqs: [
      { q: "What vehicles have quarter window regulators?", a: "Quarter window regulators are found on some SUVs, minivans, and extended-cab trucks that have operable rear quarter windows." },
    ],
  },
  {
    slug: "window-regulator-rear",
    name: "Window Regulator Rear",
    category: "body",
    description: "Used rear window regulators with motor. Tested for smooth operation on both sides.",
    longDescription: "Rear window regulators raise and lower the rear door windows. Our used rear window regulators include the motor and are tested for smooth operation in both directions. We carry regulators for both left and right rear doors.",
    benefits: ["Motor included", "Both directions tested", "Left and right available", "All vehicle makes", "Easy installation"],
    faqs: [
      { q: "Can I replace just the motor or do I need the whole regulator?", a: "In most modern vehicles, the motor is integrated with the regulator and they must be replaced as a unit. Some older vehicles allow separate motor replacement." },
    ],
  },
  {
    slug: "wiper-motor",
    name: "Wiper Motor",
    category: "electrical",
    description: "Used windshield wiper motors. Tested for all speed settings including intermittent and high speed.",
    longDescription: "Windshield wiper motors power your front and rear wipers for clear visibility in rain and snow. Our used wiper motors are tested on all speed settings including intermittent, low, and high speed. We carry front and rear wiper motors for all makes and models.",
    benefits: ["All speeds tested", "Intermittent function verified", "Front and rear", "All vehicle makes", "Quick shipping"],
    faqs: [
      { q: "Why do my wipers only work on one speed?", a: "This is often caused by a failing wiper motor, bad wiper switch, or faulty wiper relay. A used motor replacement can fix speed-related issues." },
    ],
  },
  // ─── Additional Parts (Beyond old site) ───
  {
    slug: "alternator",
    name: "Alternator",
    category: "electrical",
    description: "Used alternators tested for proper voltage output and charging capacity. All amperage ratings available.",
    longDescription: "The alternator generates electricity to charge the battery and power your vehicle's electrical systems. Our used alternators are load-tested for proper voltage output (13.5-14.5V) and verified for adequate charging amperage. We carry alternators from low-output economy units to high-output performance alternators.",
    benefits: ["Voltage tested (13.5-14.5V)", "Amperage verified", "All output ratings", "Tested under load", "Pulley included"],
    faqs: [
      { q: "How do I know if my alternator is failing?", a: "Signs include dimming headlights, battery warning light on dashboard, dead battery, whining noise from the engine, and electrical accessories malfunctioning." },
      { q: "How long does a used alternator last?", a: "A quality used alternator can last 50,000-100,000+ miles. Our units are load-tested before shipping to ensure reliable performance." },
    ],
  },
  {
    slug: "starter-motor",
    name: "Starter Motor",
    category: "electrical",
    description: "Used starter motors for all makes. Bench tested for proper cranking operation and solenoid engagement.",
    longDescription: "The starter motor cranks the engine for starting. Our used starter motors are bench-tested for proper solenoid engagement, cranking speed, and current draw. We carry direct-drive and gear-reduction starters for all vehicle makes and engine sizes.",
    benefits: ["Bench tested", "Solenoid verified", "Proper cranking speed", "All makes and models", "Direct-drive and gear-reduction"],
    faqs: [
      { q: "What are signs of a bad starter?", a: "Signs include clicking sound when turning the key, grinding noise during starting, intermittent starting issues, and the engine not cranking at all." },
    ],
  },
  {
    slug: "radiator",
    name: "Radiator",
    category: "cooling",
    description: "Used radiators for all vehicles. Pressure tested for leaks with fins and tanks inspected.",
    longDescription: "The radiator is the primary cooling component that removes heat from the engine coolant. Our used radiators are pressure-tested for leaks, inspected for fin damage, and checked for tank integrity. We carry aluminum and copper/brass radiators for all vehicle types.",
    benefits: ["Pressure tested", "No leaks guaranteed", "Fins inspected", "All materials", "Proper cooling capacity"],
    faqs: [
      { q: "How do I know if my radiator is bad?", a: "Signs include engine overheating, coolant leaks under the car, discolored coolant, low coolant level, and visible damage to radiator fins or tanks." },
    ],
  },
  {
    slug: "water-pump",
    name: "Water Pump",
    category: "cooling",
    description: "Used water pumps for all engines. Tested for proper flow and seal integrity.",
    longDescription: "The water pump circulates coolant through the engine and radiator to maintain proper operating temperature. Our used water pumps are tested for proper impeller function, bearing smoothness, and seal integrity.",
    benefits: ["Flow tested", "Bearing verified", "Seal integrity checked", "All engine types", "Includes gasket when available"],
    faqs: [
      { q: "How do I know if my water pump is failing?", a: "Signs include coolant leaks at the pump, engine overheating, squealing noise from the pump bearing, and steam from the engine bay." },
    ],
  },
  {
    slug: "ecu-pcm-module",
    name: "ECU / PCM Module",
    category: "electrical",
    description: "Used Engine Control Units and Powertrain Control Modules. Tested for proper operation and communication.",
    longDescription: "The ECU (Engine Control Unit) or PCM (Powertrain Control Module) is the computer brain of your vehicle. It controls fuel injection, ignition timing, emissions, and transmission operation. Our used ECUs/PCMs are tested for proper operation, verified for correct part numbers, and checked for stored fault codes.",
    benefits: ["Tested and verified", "Correct part numbers matched", "All protocols supported", "VIN programming available", "Major cost savings"],
    faqs: [
      { q: "Will a used ECU work in my car?", a: "Used ECUs must match your vehicle's exact specifications. Some require VIN programming by a dealer or specialized technician. We match by part number to ensure compatibility." },
      { q: "How much does a used ECU cost?", a: "Used ECUs range from $100-$800 depending on the vehicle, compared to $500-$3,000+ for new dealer units." },
    ],
  },
  {
    slug: "door-assembly",
    name: "Door Assembly",
    category: "body",
    description: "Complete used door assemblies with glass, regulator, and hardware. Color-matched when possible.",
    longDescription: "Our complete door assemblies include the door shell, glass, window regulator, mirror, handle, lock mechanism, and wiring harness. We can source doors in matching colors when available, reducing or eliminating the need for painting.",
    benefits: ["Complete with glass", "Regulator included", "Color matching available", "All positions", "Hardware included"],
    faqs: [
      { q: "Does a used door come painted?", a: "Yes, used doors come in their original paint color. We try to match your vehicle's color code. Some color variation may occur between production years." },
    ],
  },
  {
    slug: "hood",
    name: "Hood",
    category: "body",
    description: "Used hoods for all vehicles. Inspected for dents, rust, and hinge alignment.",
    longDescription: "Our used hoods are inspected for structural integrity, paint condition, rust, and proper hinge alignment. We carry steel, aluminum, and composite hoods for all vehicle makes and models.",
    benefits: ["No structural damage", "Hinges included", "All materials", "Color matching available", "Latch mechanism checked"],
    faqs: [
      { q: "Will a used hood fit my car?", a: "We match hoods by exact year, make, and model to ensure proper fitment. Bolt patterns and mounting points must align with your vehicle." },
    ],
  },
  {
    slug: "front-bumper",
    name: "Front Bumper",
    category: "body",
    description: "Used front bumper covers and reinforcements. Available painted or unpainted.",
    longDescription: "Our used front bumper assemblies include the bumper cover, reinforcement bar, and associated brackets. We offer painted bumpers in factory colors and unpainted options for custom finishing. Fog light openings, sensor holes, and trim mountings are verified for your specific model.",
    benefits: ["Cover and reinforcement", "Factory colors available", "Sensor openings verified", "Brackets included", "All makes and models"],
    faqs: [
      { q: "Does a used bumper come with fog lights?", a: "Fog lights may or may not be included depending on the donor vehicle. We list exactly what is included with each bumper assembly." },
    ],
  },
  {
    slug: "rear-bumper",
    name: "Rear Bumper",
    category: "body",
    description: "Used rear bumper covers and assemblies. Sensor holes and exhaust cutouts verified.",
    longDescription: "Our used rear bumper assemblies include the bumper cover, reinforcement bar, and brackets. We verify sensor holes for parking sensors, camera mounting points, and exhaust cutouts match your specific vehicle configuration.",
    benefits: ["Sensor holes verified", "Camera mount checked", "Exhaust cutouts matched", "Factory colors", "Complete assemblies"],
    faqs: [
      { q: "Will a used rear bumper have parking sensor holes?", a: "We match bumpers to your exact vehicle configuration. If your car has parking sensors, we source bumpers with the correct sensor hole positions." },
    ],
  },
  {
    slug: "fender",
    name: "Fender",
    category: "body",
    description: "Used front and rear fenders. Inspected for rust, dents, and mounting point integrity.",
    longDescription: "Our used fenders are inspected for rust, dents, paint condition, and mounting point integrity. We carry fenders for all vehicle makes and models, with color matching available to reduce painting costs.",
    benefits: ["No rust through", "Mounting points verified", "Color matching available", "Left and right", "Hardware included when available"],
    faqs: [
      { q: "Is it cheaper to repair or replace a fender?", a: "For minor dents, repair may be cheaper. For significant damage, rust, or body line damage, a quality used replacement fender is often more cost-effective." },
    ],
  },
  {
    slug: "headlight-assembly",
    name: "Headlight Assembly",
    category: "body",
    description: "Used headlight assemblies including housing, lens, and bulbs. All functions tested.",
    longDescription: "Our used headlight assemblies include the housing, lens, reflector, bulbs, and adjusters. Every assembly is tested for low beam, high beam, and turn signal function. We carry halogen, HID/Xenon, and LED headlights for all vehicle makes.",
    benefits: ["All functions tested", "Lens clarity verified", "Adjusters working", "Halogen/HID/LED", "Left and right available"],
    faqs: [
      { q: "Are used headlights cloudy?", a: "We inspect lens clarity and only sell headlights in good condition. Minor cloudiness can be polished out. We do not sell severely yellowed or hazed units." },
    ],
  },
  {
    slug: "tail-light-assembly",
    name: "Tail Light Assembly",
    category: "body",
    description: "Used tail light assemblies with all bulbs. Brake, turn, and reverse lights tested.",
    longDescription: "Our used tail light assemblies include the housing, lens, bulbs, and wiring connector. Every assembly is tested for brake lights, turn signals, reverse lights, and running lights. We match by exact year and model for perfect fitment.",
    benefits: ["All functions tested", "No cracks or moisture", "Bulbs included", "Perfect fitment", "Left and right available"],
    faqs: [
      { q: "Can moisture get inside a used tail light?", a: "We inspect for moisture intrusion and seal integrity. Units with internal moisture or cracked lenses are not sold. Our tail lights are dry and functional." },
    ],
  },
  {
    slug: "dashboard",
    name: "Dashboard",
    category: "body",
    description: "Used dashboard assemblies. Inspected for cracks, airbag compatibility, and color matching.",
    longDescription: "Our used dashboard assemblies are inspected for cracks, UV damage, airbag housing integrity, and color matching. Dashboards include mounting points for instruments, vents, and trim pieces. We carry dashboards for all vehicle makes and models.",
    benefits: ["No cracks", "Airbag compatible", "Color matched", "Vents included when available", "Trim pieces checked"],
    faqs: [
      { q: "Do used dashboards come with airbags?", a: "Used dashboards may or may not include the passenger airbag. This varies by availability and is listed in the item description. Airbag integrity is always verified." },
    ],
  },
  {
    slug: "seat-assembly",
    name: "Seat Assembly",
    category: "body",
    description: "Used front and rear seat assemblies. Power functions tested, upholstery inspected.",
    longDescription: "Our used seat assemblies include the frame, upholstery, foam, tracks, and all motors (power seats). We test all power functions including forward/back, up/down, recline, lumbar, and heating/cooling where applicable. Leather, cloth, and sport seat options available.",
    benefits: ["Power functions tested", "Upholstery inspected", "Heating/cooling verified", "All materials", "Front and rear available"],
    faqs: [
      { q: "Can I swap cloth seats for leather?", a: "In many vehicles, you can swap in leather seats from the same model. Mounting points are typically identical, though electrical connectors may vary by option level." },
    ],
  },
  {
    slug: "door-mirror",
    name: "Door Mirror",
    category: "body",
    description: "Used side mirrors with power adjust, heat, and turn signal functions. Glass and motor tested.",
    longDescription: "Our used door mirrors include the housing, glass, motor, heater element, and turn signal (where applicable). We test all functions including power adjustment, folding, heating, auto-dimming, blind spot monitoring, and integrated turn signals.",
    benefits: ["All functions tested", "Power adjust verified", "Heat function checked", "Turn signal included", "Camera compatible"],
    faqs: [
      { q: "Do used mirrors come with blind spot monitoring?", a: "Mirrors with blind spot monitoring are available when sourced from vehicles equipped with that feature. We match by option level." },
    ],
  },
  {
    slug: "quarter-panel",
    name: "Quarter Panel",
    category: "body",
    description: "Used quarter panels for body repair. Inspected for rust, structural integrity, and fitment.",
    longDescription: "Quarter panels form the rear body structure of your vehicle. Our used quarter panels are inspected for rust, accident damage, and proper fitment. Since quarter panels are welded to the body, professional installation is required.",
    benefits: ["No rust through", "Structural integrity", "Proper fitment verified", "Left and right", "Professional installation recommended"],
    faqs: [
      { q: "Can I install a quarter panel myself?", a: "Quarter panels are welded to the vehicle body and require professional body shop installation with welding equipment and expertise." },
    ],
  },
  {
    slug: "tailgate",
    name: "Tailgate",
    category: "body",
    description: "Used tailgates for trucks and SUVs. Latch, handle, and power functions tested.",
    longDescription: "Our used tailgates include the gate, handle, latch mechanism, and associated hardware. For power tailgates, we test the open/close function and safety sensors. We carry tailgates for all truck and SUV makes.",
    benefits: ["Latch mechanism tested", "Handle included", "Power function verified", "Camera mount checked", "Color matching available"],
    faqs: [
      { q: "Do used tailgates come with the backup camera?", a: "Backup cameras may or may not be included depending on the donor vehicle. We indicate camera inclusion in the listing." },
    ],
  },
  {
    slug: "airbag-module",
    name: "Airbag Module",
    category: "body",
    description: "Used airbag modules including driver, passenger, side, and curtain airbags. Never deployed units only.",
    longDescription: "Our used airbag modules are sourced from vehicles where airbags were never deployed. We carry driver frontal, passenger frontal, side-impact, knee, and curtain airbags. Every module is inspected for physical condition and connector integrity.",
    benefits: ["Never deployed", "All positions available", "Physical condition verified", "Connectors intact", "OEM safety standards"],
    faqs: [
      { q: "Is it safe to use a used airbag?", a: "Used airbags that have never been deployed are as safe as new ones. We only sell undeployed airbag modules that have been physically inspected." },
      { q: "Do used airbags need to be coded to my vehicle?", a: "In most vehicles, airbag modules are plug-and-play. However, the airbag control module (SRS module) may need to be reset after installation." },
    ],
  },
  {
    slug: "instrument-cluster",
    name: "Instrument Cluster",
    category: "electrical",
    description: "Used instrument clusters with all gauges tested. Mileage documented for proper records.",
    longDescription: "Our used instrument clusters display speed, RPM, fuel level, temperature, and warning indicators. Every cluster is tested for all gauge operation, backlight function, and warning indicator verification. Mileage on the cluster is documented.",
    benefits: ["All gauges tested", "Backlights verified", "Mileage documented", "Warning lights checked", "OEM specifications"],
    faqs: [
      { q: "Can the mileage on a used cluster be corrected?", a: "Yes, most modern instrument clusters can have the mileage programmed by a dealer or qualified technician to match your vehicle's actual mileage." },
    ],
  },
  {
    slug: "brake-caliper",
    name: "Brake Caliper",
    category: "brakes",
    description: "Used brake calipers for all vehicles. Inspected for piston operation and slide pin movement.",
    longDescription: "Brake calipers squeeze the brake pads against the rotors to slow your vehicle. Our used brake calipers are inspected for proper piston operation, slide pin movement, bleeder valve function, and mounting bracket integrity.",
    benefits: ["Piston operation verified", "Slide pins checked", "Bleeder valve functional", "Brackets included", "All positions available"],
    faqs: [
      { q: "Should I replace brake calipers in pairs?", a: "It's recommended to replace calipers in pairs (both fronts or both rears) to ensure even braking force distribution." },
    ],
  },
  {
    slug: "catalytic-converter",
    name: "Catalytic Converter",
    category: "exhaust",
    description: "Used catalytic converters for emissions-compliant repairs. Substrate condition verified.",
    longDescription: "Catalytic converters reduce harmful exhaust emissions by converting pollutants into less harmful gases. Our used catalytic converters have verified substrate integrity and are suitable for emissions-compliant repairs where local regulations permit used parts.",
    benefits: ["Substrate intact", "Emissions compliant", "All vehicle types", "Direct-fit available", "Cost-effective solution"],
    faqs: [
      { q: "Can I use a used catalytic converter?", a: "Regulations vary by state. Some states allow used catalytic converters while others require new or CARB-certified units. Check your local regulations." },
    ],
  },
  {
    slug: "oxygen-sensor",
    name: "Oxygen Sensor",
    category: "electrical",
    description: "Used oxygen (O2) sensors for all vehicles. Tested for proper voltage output and response time.",
    longDescription: "Oxygen sensors monitor exhaust gas composition to optimize fuel injection and monitor catalytic converter efficiency. Our used O2 sensors are tested for proper voltage output, response time, and heater circuit operation.",
    benefits: ["Voltage output tested", "Response time verified", "Heater circuit checked", "All positions", "OEM specifications"],
    faqs: [
      { q: "How many oxygen sensors does my car have?", a: "Most modern vehicles have 2-4 oxygen sensors - upstream (before the catalytic converter) and downstream (after the converter) on each exhaust bank." },
    ],
  },
  {
    slug: "mass-air-flow-sensor",
    name: "Mass Air Flow Sensor",
    category: "electrical",
    description: "Used MAF sensors for all engine types. Calibrated readings and voltage output verified.",
    longDescription: "The Mass Air Flow (MAF) sensor measures the amount and density of air entering the engine for precise fuel injection control. Our used MAF sensors are tested for accurate airflow readings and proper voltage output across the entire operating range.",
    benefits: ["Calibrated readings", "Voltage verified", "All engine types", "Connector intact", "Quick replacement"],
    faqs: [
      { q: "Can I clean a MAF sensor instead of replacing it?", a: "Sometimes cleaning with dedicated MAF cleaner spray restores function. However, if the sensing element is damaged or contaminated beyond cleaning, replacement is necessary." },
    ],
  },
  {
    slug: "ignition-coil",
    name: "Ignition Coil",
    category: "electrical",
    description: "Used ignition coils tested for proper spark output and resistance values.",
    longDescription: "Ignition coils transform low battery voltage into the high voltage needed to create a spark at the spark plugs. Our used ignition coils are tested for proper primary and secondary resistance, spark output, and connector integrity.",
    benefits: ["Spark output tested", "Resistance verified", "All configurations", "Coil-on-plug available", "OEM specifications"],
    faqs: [
      { q: "Should I replace all ignition coils at once?", a: "While not always necessary, replacing all coils at the same time ensures even spark performance. At minimum, replace the failed coil and consider replacing any others with similar mileage." },
    ],
  },
  {
    slug: "fuel-injector",
    name: "Fuel Injector",
    category: "engines",
    description: "Used fuel injectors cleaned and flow-tested for proper spray pattern and volume.",
    longDescription: "Fuel injectors deliver precisely metered fuel into the engine's intake or directly into the combustion chamber. Our used fuel injectors are cleaned, flow-tested, and verified for proper spray pattern to ensure optimal engine performance and fuel economy.",
    benefits: ["Cleaned and tested", "Flow rate verified", "Proper spray pattern", "Port and direct injection", "Matched sets available"],
    faqs: [
      { q: "Should I replace all fuel injectors or just the bad one?", a: "Replacing all injectors ensures uniform fuel delivery. However, if only one injector has failed, replacing just that one with a flow-matched unit is acceptable." },
    ],
  },
  {
    slug: "cv-axle",
    name: "CV Axle",
    category: "drivetrain",
    description: "Used CV axles with inner and outer joints. Inspected for boot condition and joint play.",
    longDescription: "CV (Constant Velocity) axles transfer power from the transmission to the front wheels while allowing for suspension travel and steering angle changes. Our used CV axles are inspected for boot integrity, joint play, and proper spline condition.",
    benefits: ["Boots intact", "No joint play", "Splines inspected", "Inner and outer joints", "Left and right available"],
    faqs: [
      { q: "How do I know if my CV axle is bad?", a: "The most common sign is a clicking or popping noise during turns. You may also notice grease on the inside of the wheel from a torn CV boot, or vibration during acceleration." },
    ],
  },
  {
    slug: "torque-converter",
    name: "Torque Converter",
    category: "transmissions",
    description: "Used torque converters for automatic transmissions. Tested for proper lockup and fluid circulation.",
    longDescription: "The torque converter connects the engine to the automatic transmission, multiplying torque at low speeds and providing a fluid coupling for smooth operation. Our used torque converters are tested for proper lockup, balanced rotation, and internal clutch condition.",
    benefits: ["Lockup tested", "Balance verified", "Clutch condition checked", "All stall speeds", "Matched to your transmission"],
    faqs: [
      { q: "How do I know if my torque converter is bad?", a: "Signs include shuddering at highway speeds, transmission slipping, overheating, unusual noises, and delayed engagement when shifting from park to drive." },
    ],
  },
]

// ─── Brand-Specific Content ───

export interface BrandContent {
  intro: string
  detailedDescription: string
  partsIntro: string
  orderingProcess: string
  shippingInfo: string
  warrantyInfo: string
  returnPolicy: string
  whyBuyOnline: string
}

// Generate brand-specific content dynamically
export function getBrandContent(brand: string): BrandContent {
  return {
    intro: `AUAPW LLC is one of the leading online used auto parts locator offering bespoke products with the most affordable prices in the industry. If you need quality ${brand.toLowerCase()} used auto parts as quick as possible, you are in the correct place. AUAPW LLC is a one-stop online shop where you can find all kinds of ${brand.toLowerCase()} used auto parts at the most affordable prices. We help our customers locate quality ${brand.toLowerCase()} used auto parts around the USA within 24 hours.`,
    detailedDescription: `Buying new ${brand} auto parts can be very expensive, so why pay that much if you can get a used one much cheaper? Order your desired used engines and used transmissions online at really affordable prices and high durability that will serve your car for a long period. On AUAPW LLC, you can find a simple search tool that helps you find a wide variety of used car parts from different dealers. We help you connect with the best suppliers without extra efforts, serving as a bridge between you and the dealers. After choosing your desired ${brand.toLowerCase()} used auto parts and contacting a dealer, you will receive a response in less than 24 hours. All you need is internet access -- no need to roam around different junkyards to find a car part -- we do it all for you.`,
    partsIntro: `Browse our complete selection of used ${brand} parts below. Every part listed is available from our network of 2,000+ verified salvage yards and junkyards across the USA. From engines and transmissions to body panels and electrical components, AUAPW LLC has the ${brand} part you need.`,
    orderingProcess: `To make an order, first, you need to find your desired auto part. To do this, you can use our custom-designed ${brand.toLowerCase()} auto parts locator that browses through all the junkyards across the country. All you need to do is fill in the car details, such as year, make, model, etc. and press the search button. The locator will find the best options at the most affordable prices. Choose the one that fits your car best and make an order. After you provide your contact details, AUAPW LLC will get in touch with you within 24 hours.`,
    shippingInfo: `No matter from where you are ordering, you will get your order shipped to your house, office or anywhere else for completely free. Simply order your desired OEM used ${brand} car part and get it delivered to any location in the USA without any charge. Most parts ship within 1-3 business days.`,
    warrantyInfo: `In case you face any problems during maintenance, just know that the used part is under warranty for a certain period. For every used ${brand} part you buy, AUAPW LLC dealers provide you with a warranty from 30 up to 180 days. Engines and transmissions typically carry a 6-month warranty with full return and replacement coverage.`,
    returnPolicy: `In case if you are not satisfied with your order, just send it back, as we provide a return option as well. Also, if you have ordered the wrong ${brand} part you can return it and order the right one. AUAPW LLC does our best for our customers' satisfaction. Returns are accepted within the warranty period with no restocking fees.`,
    whyBuyOnline: `If you are very busy and don't have extra time to spend roaming around junkyards and auto recyclers, then AUAPW LLC is the best option for you. In just 24 hours you find a great deal without going anywhere. Besides, you buy your ${brand} part way cheaper than it will cost you to buy a new one plus you get it shipped for free. Our network compares prices from 2,000+ yards to ensure you get the absolute best deal available.`,
  }
}

// Part options for the form (engine-specific options)
export const ENGINE_OPTIONS = [
  "2.0L 4 Cylinder",
  "2.4L 4 Cylinder",
  "2.5L 4 Cylinder",
  "2.7L V6",
  "3.0L V6",
  "3.3L V6",
  "3.5L V6",
  "3.6L V6",
  "3.8L V6",
  "4.0L V6",
  "4.3L V6",
  "4.6L V8",
  "4.7L V8",
  "5.0L V8",
  "5.3L V8",
  "5.7L V8 (Hemi)",
  "6.0L V8",
  "6.2L V8",
  "6.4L V8",
  "6.6L V8 Diesel",
  "6.7L V8 Diesel",
  "7.3L V8 Diesel",
  "1.5L 4 Cylinder Turbo",
  "1.6L 4 Cylinder Turbo",
  "2.0L 4 Cylinder Turbo",
  "2.3L 4 Cylinder Turbo (EcoBoost)",
  "2.7L V6 Turbo (EcoBoost)",
  "3.0L V6 Turbo",
  "3.5L V6 Turbo (EcoBoost)",
  "1.8L 4 Cylinder Hybrid",
  "2.0L 4 Cylinder Hybrid",
  "2.5L 4 Cylinder Hybrid",
  "Electric Motor",
]

export const TRANSMISSION_OPTIONS = [
  "4-Speed Automatic",
  "5-Speed Automatic",
  "6-Speed Automatic",
  "8-Speed Automatic",
  "9-Speed Automatic",
  "10-Speed Automatic",
  "5-Speed Manual",
  "6-Speed Manual",
  "CVT (Continuously Variable)",
  "Dual Clutch (DCT/DSG)",
  "E-CVT Hybrid",
  "Single-Speed (Electric)",
]

export const OTHER_PART_OPTIONS = [
  "Front Left",
  "Front Right",
  "Rear Left",
  "Rear Right",
  "Driver Side",
  "Passenger Side",
  "Upper",
  "Lower",
  "Complete Assembly",
  "Without Motor",
  "With Motor",
  "With Turbo",
  "Without Turbo",
  "FWD (Front Wheel Drive)",
  "RWD (Rear Wheel Drive)",
  "AWD (All Wheel Drive)",
  "4WD (Four Wheel Drive)",
]

// Get options based on selected part
export function getPartOptions(partName: string): string[] {
  const lower = partName.toLowerCase()
  if (lower.includes("engine") || lower === "turbo charger" || lower === "cylinder head") {
    return ENGINE_OPTIONS
  }
  if (lower.includes("transmission") || lower === "torque converter" || lower === "transfer case") {
    return TRANSMISSION_OPTIONS
  }
  return OTHER_PART_OPTIONS
}

// Get all parts for a specific category
export function getPartsByCategory(categoryId: string): PartInfo[] {
  return ALL_PARTS.filter(p => p.category === categoryId)
}

// Get a specific part by slug
export function getPartBySlug(slug: string): PartInfo | undefined {
  return ALL_PARTS.find(p => p.slug === slug)
}

// Get all unique categories
export function getAllCategories(): string[] {
  return [...new Set(ALL_PARTS.map(p => p.category))]
}
