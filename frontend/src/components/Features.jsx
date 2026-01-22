import { Truck, ShieldCheck, Zap} from "lucide-react";
import { cloneElement } from "react";

const Features = () => {
  const data = [
    { icon: <Truck />, title: "Express Delivery", desc: "Free shipping on orders over 5000", color: "text-blue-600" },
    { icon: <ShieldCheck />, title: "2 Year Warranty", desc: "Certified brand protection", color: "text-green-600" },
    { icon: <Zap />, title: "Instant Setup", desc: "Expert technical assistance", color: "text-amber-500" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        {data.map((item, idx) => (
          <div key={idx} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow group">
            <div className={`h-14 w-14 rounded-xl flex items-center justify-center mb-6 bg-white shadow-sm group-hover:scale-110 transition-transform ${item.color}`}>
              {cloneElement(item.icon, { size: 28 })}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
            <p className="text-slate-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;