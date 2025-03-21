import connectDB from "@/lib/db";
import Company from "@/models/Company";


// GET: View job listings
export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get("title");
    const location = searchParams.get("location");
    const industry = searchParams.get("industry");
    const language = searchParams.get("language");
    const minPay = searchParams.get("minPay");
    const maxPay = searchParams.get("maxPay");
    const sortBy = searchParams.get("sortBy") || "createdAt"; // Default sorting
    const order = searchParams.get("order") === "asc" ? 1 : -1; // Sorting order

    // Step 1: Fetch all companies
    const companies = await Company.find({}, { jobListings: 1, name: 1 });

    // Step 2: Extract and filter job listings at the application level
    let jobListings = companies.flatMap((company) =>
      company.jobListings
        .filter((job) => {
          return (
            (!title || new RegExp(`^${title}$`, "i").test(job.title)) &&
            (!location || job.location === location) &&
            (!industry || job.industry === industry) &&
            (!language || job.language === language) &&
            (!minPay || job.pay.min >= Number(minPay)) &&
            (!maxPay || job.pay.max <= Number(maxPay))
          );
        })
        .map((job) => ({
          ...job.toObject(),
          companyName: company.name,
        }))
    );

    // Step 3: Apply sorting
    jobListings = jobListings.sort((a, b) =>
      order === 1 ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]
    );

    return Response.json({ success: true, jobListings }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error fetching job listings", details: error.message }, { status: 500 });
  }
}


// POST: Create a new job listing
export async function POST(req) {
  await connectDB();

  try {
    const { companyName, title, description, pay, language, location, industry } = await req.json();

    if (!companyName || !title || !description || !pay?.min || !pay?.max || !language || !location || !industry) {
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }

    const company = await Company.findOne({ name: companyName });
    if (!company) {
        const createCompany=await Company.create({name:companyName});
    }


    const newJob = { title, description, pay, language, location, industry };
    company.jobListings.push(newJob);
    await company.save();

    return Response.json({ success: true, data: newJob }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Error posting job listing", details: error.message }, { status: 500 });
  }
}

// DELETE: Remove a job listing by jobId and companyName
export async function DELETE(req) {
  await connectDB();

  try {
    const { companyName, jobId } = await req.json();

    if (!companyName || !jobId) {
      return Response.json({ error: "Company name and job ID are required" }, { status: 400 });
    }

    const company = await Company.findOne({ name: companyName });
    if (!company) {
      return Response.json({ error: "Company not found" }, { status: 404 });
    }

    const updatedJobListings = company.jobListings.filter(
      (job) => job._id.toString() !== jobId
    );

    if (updatedJobListings.length === company.jobListings.length) {
      return Response.json({ error: "Job listing not found" }, { status: 404 });
    }

    company.jobListings = updatedJobListings;
    await company.save();

    return Response.json({ success: true, message: "Job listing deleted successfully" }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error deleting job listing", details: error.message }, { status: 500 });
  }
}

// // GET: Retrieve all job listings for a company
// export async function GET(req) {
//   await connectDB();

//   try {
//     const { searchParams } = new URL(req.url);
//     const companyName = searchParams.get("companyName");

//     if (!companyName) {
//       return Response.json({ error: "Company name is required" }, { status: 400 });
//     }

//     const company = await Company.findOne({ name: companyName });

//     if (!company) {
//       return Response.json({ error: "Company not found" }, { status: 404 });
//     }

//     return Response.json({ success: true, jobListings: company.jobListings }, { status: 200 });
//   } catch (error) {
//     return Response.json({ error: "Error fetching job listings", details: error.message }, { status: 500 });
//   }
// }
