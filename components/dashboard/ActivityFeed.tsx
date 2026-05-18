interface Activity {
  id: string;
  text: string;
  time: string;
  type: 'quotation' | 'price' | 'client' | 'import';
}

const ACTIVITIES: Activity[] = [
  { id: '1', text: 'Quotation #Q8 generated for Pure Harvest Nutraceuticals',       time: '1 hour ago',   type: 'quotation' },
  { id: '2', text: 'Whey Protein Concentrate price updated to ₹890/100KG',           time: '3 hours ago',  type: 'price' },
  { id: '3', text: 'New client added: Fit India Supplements',                        time: '5 hours ago',  type: 'client' },
  { id: '4', text: 'Ingredient file imported - 25 items added',                     time: '7 hours ago',  type: 'import' },
  { id: '5', text: 'Quotation #Q7 created for Fit India Supplements',               time: 'Yesterday',    type: 'quotation' },
  { id: '6', text: 'Spirulina Powder price updated to ₹2,850/100KG',               time: 'Yesterday',    type: 'price' },
  { id: '7', text: 'Quotation #Q6 sent to Nature Wellness Co.',                     time: '2 days ago',   type: 'quotation' },
  { id: '8', text: 'New client added: Pure Harvest Nutraceuticals',                 time: '2 days ago',   type: 'client' },
  { id: '9', text: 'Ashwagandha Extract added to ingredient database',              time: '3 days ago',   type: 'import' },
  { id: '10', text: 'Quotation #Q5 archived - BodyFortress India',                 time: '4 days ago',   type: 'quotation' },
];

const TYPE_COLORS: Record<string, string> = {
  quotation: 'bg-[#25d366]',
  price:     'bg-[#ff8800]',
  client:    'bg-[#314f2d]',
  import:    'bg-[#7c9f43]',
};

export default function ActivityFeed() {
  return (
    <div>
      <h2 className="type-h3-18 text-[#0a0a0a] mb-4">Recent Activity</h2>
      <div className="space-y-0">
        {ACTIVITIES.map((activity, i) => (
          <div key={activity.id} className="flex gap-3 py-3 border-b border-[#f2f6ef] last:border-0">
            <div className="flex flex-col items-center flex-shrink-0 mt-1">
              <span className={`w-2 h-2 rounded-full ${TYPE_COLORS[activity.type]} flex-shrink-0`} />
              {i < ACTIVITIES.length - 1 && <div className="w-px flex-1 bg-[#e8ece5] mt-1" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#373737] leading-snug">{activity.text}</p>
              <p className="text-[11px] text-[#a3a29e] mt-0.5">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
