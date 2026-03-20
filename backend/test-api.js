#!/usr/bin/env node

require("dotenv").config();
const axios = require("axios");

const BASE_URL = "http://localhost:5000/api/v1";
const API_HEALTH = "http://localhost:5000/api/health";

console.log("\n╔════════════════════════════════════════════════════╗");
console.log("         API ENDPOINT TESTING SUITE");
console.log("╚════════════════════════════════════════════════════╝\n");

const tests = [
  {
    name: "Health Check",
    method: "GET",
    url: API_HEALTH,
    description: "Verify API is running"
  },
  {
    name: "Get All Recipes",
    method: "GET",
    url: `${BASE_URL}/recipes`,
    description: "READ from database - recipes collection"
  },
  {
    name: "Get All Users",
    method: "GET",
    url: `${BASE_URL}/admin/users`,
    description: "Admin endpoint - requires auth (will fail without token)",
    expectFail: true
  }
];

let passed = 0;
let failed = 0;

async function runTests() {
  for (const test of tests) {
    try {
      console.log(`📋 TEST: ${test.name}`);
      console.log(`   Method: ${test.method}`);
      console.log(`   URL: ${test.url}`);
      console.log(`   Description: ${test.description}`);

      const response = await axios({
        method: test.method,
        url: test.url,
        timeout: 5000
      });

      console.log(`   ✅ Status: ${response.status}`);
      console.log(`   Data: ${JSON.stringify(response.data).substring(0, 100)}...`);
      passed++;
      console.log("");

    } catch (error) {
      if (test.expectFail) {
        console.log(`   ⚠️ Expected Error (requires auth): ${error.response?.status || error.message}`);
        passed++;
      } else {
        console.log(`   ❌ ERROR: ${error.message}`);
        if (error.response?.data) {
          console.log(`   Response: ${JSON.stringify(error.response.data)}`);
        }
        failed++;
      }
      console.log("");
    }
  }

  // Summary
  console.log("\n╔════════════════════════════════════════════════════╗");
  console.log("         TEST SUMMARY");
  console.log("╚════════════════════════════════════════════════════╝\n");
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${tests.length}\n`);

  if (failed === 0) {
    console.log("🎉 ALL CRITICAL TESTS PASSED!\n");
    process.exit(0);
  } else {
    console.log("⚠️ Some tests failed. Check configuration.\n");
    process.exit(1);
  }
}

runTests();
