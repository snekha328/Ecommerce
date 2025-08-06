const Product = require('./Product')
const Deal = require('./Deals')

const selectTodaysDeals = async () => {
    try {
        const products = await Product.find();

        if(products.length===0){
            console.log('No Products found')
            return;
        }

        const shuffledProducts = products.sort(()=>0.5-Math.random());
        //const selectedProducts = shuffledProducts.slice(0,20)

       // console.log('Deal Products:', selectedProducts); // Add this line to check selected products

        const today = new Date();
        const startOfDay = new Date(today.setHours(0,0,0,0));
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        await Deal.deleteMany({
            startDate:{$gte:startOfDay},
            endDate:{$lte:endOfDay}
        })

        const dealLimit = 20;
        let selectedProducts=[];

        while (selectedProducts.length<dealLimit&&shuffledProducts.length>0 ){

            const randomProduct = shuffledProducts.pop()
            const existingDeal = await Deal.findOne({
                product: randomProduct._id,
                startDate:{$gte:startOfDay},
                endDate:{$lte:endOfDay}
            });

            if(!existingDeal){
                selectedProducts.push(randomProduct);
                 const randomDiscount = Math.floor(Math.random()*(50-10+1))+10;

                const newDeal = new Deal({
                    product: randomProduct._id,
                    discountPercentage: randomDiscount,
                    startDate: today,
                    endDate:endOfDay,
                });
                await newDeal.save();
            }
        }

        

        console.log('Today\'s deals have been saved'); // Add this line to check saved deals

    } catch (error) {
        console.error('Error selecting today\'s deals:', error);
    }
};


module.exports = selectTodaysDeals;
