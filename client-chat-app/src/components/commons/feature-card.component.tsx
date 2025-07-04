type FeatureCardProps = { icon: React.ReactNode; title: string; desc: string }

export function FeatureCard({ icon, title, desc }: FeatureCardProps) {
	return (
		<div className='bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer'>
			<div className='mb-4'>{icon}</div>
			<h3 className='text-lg font-semibold text-slate-800'>{title}</h3>
			<p className='mt-1 text-slate-600 text-sm'>{desc}</p>
		</div>
	)
}
