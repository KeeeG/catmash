# catmash
**Basic voting system for the cutest cat** 

The purpose of this exercise is to develop a mini web application that allows you to find the cutest cat.

Based on the Facemash UX and data from https://latelier.co/data/cats.json.

The application should therefore be composed of two pages:
- A page to vote.
- A page to see all the cats with their score.
- No requirement on technical choices.
- The application must be able to be used from Google Chrome.
- The project must be published on a public GitHub repository.
- The project must be hosted to be publicly accessible.
---------------
PS: Due to shortage of time, I was able to set up this architecture and implement the lambdas. I didn't have enough time to focus on the front-end side.

---------------
**Current architecure:** 
- AWS ( Lambda, API Gateway, VPC, Security Group, MySQL Aurora, S3)
- Programming langage: Node.js 12.6
![Current AWS architecture](https://catmashvoting.s3.amazonaws.com/catmash.jpeg)
Life Cycle:
- S3: conatines 2 public static html pages that calls the API via HttpRequest using javascript in an ugly way (Focused on Backend only)
- The REST API requests are configured with API Gateway
- API Gateway triggers the two Lambdas written in Node.js 12.6
- The Lambdas requests and writes into the Amazon Aurora database.
- PS: The cats infos (id, url) are stored in a static json file used by the lambdas.

---------------
**Better architecture if more time have been given:** 
- AWS ( Lambda, API Gateway, VPC, Security Group, MySQL Aurora, S3, Route53, EC2, CloudFront, Internet Gateway, Elastic IP)
- Programming langage: Node.js 12.6, Angular 8
Life Cycle:
- Route 53 will convert the URL request by the final user to the T2 EC2 instance Elastic IP
- The EC2 instance containes the frontend side of the application which will get the cat images stored in an S3 Bucket
- CloudFront will saves us some cost since the cats images won't be chaging much
- Angular will consumer our API via API Gateway
- API Gateway triggers the two Lambdas written in Node.js 12.6
- The Lambdas requests and writes into the Amazon Aurora database.

---------------
**Testing the project:** 
Since the project is hosted in a serverless architecture on AWS, we can't run the code pushed on the Github repository.
But the code is exactly the same for these four file:
- Lambda 1: Insert vote
- Lambda 2: Get all votes
- HTML 1: Vote
- HTML 2: Elections results
The two HTML are stored in S3 under these links:
- https://catmashvoting.s3.amazonaws.com/results.html
- https://catmashvoting.s3.amazonaws.com/voting.html
