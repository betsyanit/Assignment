const { Builder, By, Key, util, WebElement } = require("selenium-webdriver");
async function UserLogin() {
    try {
        let driver = await new Builder().forBrowser('chrome').build();
        var userArray = [];
        await driver.get('https://www.saucedemo.com/');
        await driver.manage().window().maximize();
        await driver.sleep(1000);
        var usernameElement = await driver.findElement(By.xpath('//div[@id="login_credentials"]'));
        var usernameText = await usernameElement.getText();
        var usernameLines = usernameText.split('\n');
        for (var line of usernameLines) {
            var username = line.trim();
            userArray.push(username);
        }
        console.log(userArray);
        var passwordElement = await driver.findElement(By.className("login_password"));
        var passwordText = await passwordElement.getText();
        var passwordLines = passwordText.split('\n');
        for (var line of passwordLines) {
            var password = line.trim();
        }
        for (let i = 1; i < userArray.length; i++) {
            var user = userArray[i];
            var userAmountArray = [];
            //standard_user workflow
            if (user == 'standard_user') {
                console.log("User: standard_user");
                var sum = 0;
                var productArray = ["Sauce Labs Backpack", "Sauce Labs Fleece Jacket"];
                await driver.findElement(By.xpath('//input[@name="user-name"]')).sendKeys(user);
                await driver.findElement(By.xpath('//input[@name="password"]')).sendKeys(password);
                await driver.findElement(By.xpath("//input[@type='submit']")).click();
                await driver.sleep(2000);
                var accountError = driver.findElements(By.xpath("//h3[text()='Epic sadface: Sorry, this user has been locked out.']"));
                if (accountError.length > 0) {
                    console.log("Oops!User account locked out.");
                    await driver.navigate().refresh();
                    break;
                }
                else {
                    console.log("Successful login!");
                    for (var p = 0; p < productArray.length; p++) {
                        var product = productArray[p];
                        await driver.sleep(3000);
                        var priceCheckHomePage = await driver.findElements(By.xpath("//div[text()='" + product + "']/parent::a/parent::div[@class='inventory_item_label']/following-sibling::div[@class='pricebar']/child::div[@class='inventory_item_price']"));
                        if (priceCheckHomePage.length > 0) {
                            var standardUserPriceHome = await driver.findElement(By.xpath("//div[text()='" + product + "']/parent::a/parent::div[@class='inventory_item_label']/following-sibling::div[@class='pricebar']/child::div[@class='inventory_item_price']")).getText();
                            var productPrice = standardUserPriceHome.replace(/\$/g, '');
                            var price = parseFloat(productPrice);
                        }
                        await driver.findElement(By.linkText(product)).click();
                        await driver.sleep(3000);
                        var priceCheckProductPage = await driver.findElements(By.xpath("//div[text()='" + product + "']/following-sibling::div[@class='inventory_details_price']"));
                        if (priceCheckProductPage.length > 0) {
                            var standardUserPriceProduct = await driver.findElement(By.xpath("//div[text()='" + product + "']/following-sibling::div[@class='inventory_details_price']")).getText();
                        }
                        if (standardUserPriceHome == standardUserPriceProduct) {
                            console.log("Price of " + product + " is: " + standardUserPriceHome);
                            console.log("Product price verified in home page and product detils page.");
                            await driver.findElement(By.xpath("//button[text()='Add to cart']")).click();
                            await driver.findElement(By.xpath("//span[@class='shopping_cart_badge']")).click();
                            await driver.sleep(2000);
                            var productBagElement = driver.findElement(By.xpath("//div[text()='" + product + "']"));
                            const elementCheck = await productBagElement;
                            if (elementCheck) {
                                console.log(product + " added to the cart successfully.");
                                var cartRemoveProduct = await driver.findElements(By.xpath("//div[text()='" + product + "']/parent::a/following-sibling::div[@class='item_pricebar']/child::button[text()='Remove']"));
                                if (cartRemoveProduct.length > 0) {
                                    console.log("Remove button is available for " + product + " in the checkout page");
                                }
                            }
                            else {
                                console.log("Oops! " + product + " not added to the cart.");
                            }
                            await driver.findElement(By.xpath("//button[@name='continue-shopping']")).click();
                            var removeProductCheck = await driver.findElements(By.xpath("//div[text()='" + product + "']/parent::a/parent::div[@class='inventory_item_label']/following-sibling::div[@class='pricebar']/child::button[text()='Remove']"));
                            if (removeProductCheck.length > 0) {
                                console.log("Remove button enabled for " + product + " in the home page.");
                            }
                        }
                        else {
                            console.log("Oops! Product price mismatch in home page and product details page.");
                        }
                    }
                    await driver.findElement(By.xpath("//span[@class='shopping_cart_badge']")).click();
                    await driver.findElement(By.xpath("//button[text()='Checkout']")).click();
                    await driver.findElement(By.xpath("//input[@id='first-name']")).sendKeys("Betsy");
                    await driver.findElement(By.xpath("//input[@id='last-name']")).sendKeys("Mathew");
                    await driver.findElement(By.xpath("//input[@id='postal-code']")).sendKeys("T3A 2E2");
                    await driver.findElement(By.xpath("//input[@id='continue']")).click();
                    await driver.sleep(3000);
                    await driver.findElement(By.xpath("//button[@id='finish']")).click();
                    var successMessage = driver.findElements(By.xpath("//h2[text()='Thank you for your order!']"));
                    var successMessageElement = await successMessage;
                    if (successMessageElement.length > 0) {
                        console.log("Products checked out successfully.");
                    }
                    await driver.sleep(2000);
                    await driver.findElement(By.xpath("//button[text()='Back Home']")).click();
                    await driver.findElement(By.xpath("//button[text()='Open Menu']")).click();
                    await driver.sleep(1000);
                    await driver.findElement(By.linkText('Logout')).click();
                    console.log("Logged out successfully.");
                }
            }
            //locked_out_user workflow
            else if (user == 'locked_out_user') {
                console.log("User: locked_out_user");
                await driver.findElement(By.xpath('//input[@name="user-name"]')).sendKeys(user);
                await driver.findElement(By.xpath('//input[@name="password"]')).sendKeys(password);
                await driver.findElement(By.xpath("//input[@type='submit']")).click();
                await driver.sleep(2000);
                var accountError = driver.findElements(By.xpath("//h3[text()='Epic sadface: Sorry, this user has been locked out.']"));
                const errorCheck = await accountError;
                if (errorCheck.length > 0) {
                    console.log("Oops!User account locked out.");
                    await driver.navigate().refresh();
                }
            }
            //problem_user workflow
            else if (user == 'problem_user') {
                console.log("User: problem_user");
                var problemUserArray = ["Sauce Labs Bike Light", "Sauce Labs Backpack", "Sauce Labs Fleece Jacket"];
                await driver.findElement(By.xpath('//input[@name="user-name"]')).sendKeys(user);
                await driver.findElement(By.xpath('//input[@name="password"]')).sendKeys(password);
                await driver.findElement(By.xpath("//input[@type='submit']")).click();
                var accountError = driver.findElements(By.xpath("//h3[text()='Epic sadface: Sorry, this user has been locked out.']"));
                if (accountError.length > 0) {
                    console.log("Oops!User account locked out.");
                    await driver.navigate().refresh();
                    break;
                }
                else {
                    console.log("Successful login!");
                    for (var k = 0; k < problemUserArray.length; k++) {
                        var problemUserProduct = problemUserArray[k];
                        await driver.sleep(2000);
                        var actualItemName = await driver.findElement(By.xpath("//div[text()='" + problemUserProduct + "']")).getText();
                        await driver.findElement(By.linkText(problemUserProduct)).click();
                        await driver.sleep(3000);
                        var expectedItemCheck = await driver.findElements(By.xpath("//div[text()='" + problemUserProduct + "']"));
                        var expectedItemName = await driver.findElement(By.xpath("//div[@class='inventory_details_name large_size']")).getText();
                        if (expectedItemCheck.length > 0) {
                            if (actualItemName == expectedItemName) {
                                console.log(problemUserProduct + " is available for purchase.");
                            }
                            var addToCartElement = await driver.findElement(By.xpath("//button[text()='Add to cart']"));
                            if (addToCartElement.length > 0) {
                                await addToCartElement.click();
                                var removeElementCheck = await driver.findElement(By.xpath("//button[text()='Remove']"));
                                if (removeElementCheck.length > 0) {
                                    console.log(problemUserProduct + " purchased using 'Add to cart' option.");
                                }

                                var elementPresent = await driver.findElements(By.xpath("//span[@class='shopping_cart_badge']"));
                                if (elementPresent.length > 0) {
                                    await elementPresent.click();
                                    console.log(problemUserProduct + " added to the cart.");
                                    var productBag = driver.findElement(By.xpath("//div[text()='" + problemUserProduct + "']")).getText();
                                    const bagElementCheck = await productBag;
                                    if (bagElementCheck) {
                                        console.log(problemUserProduct + " is avilable in the cart for check out.");
                                    }
                                    else {
                                        console.log("Oops!" + problemUserProduct + " is not available for check out.");
                                    }
                                    await driver.findElement(By.xpath("//button[text()='Checkout']")).click();
                                    await driver.findElement(By.xpath("//input[@id='first-name']")).sendKeys("Ann");
                                    await driver.findElement(By.xpath("//input[@id='last-name']")).sendKeys("Mathew");
                                    await driver.findElement(By.xpath("//input[@id='postal-code']")).sendKeys("ABC DEF");
                                    await driver.findElement(By.xpath("//input[@id='continue']")).click();
                                    var checkoutError = driver.findElement(By.xpath("//h3[text()='Error: Last Name is required']")).getText();
                                    if (checkoutError == true) {
                                        console.log("Check out failed! Last name is required for checkout.");
                                    }
                                    else {
                                        console.log(problemUserProduct + " checked out successfully.");
                                    }
                                }
                            }
                        }
                        else {
                            console.log("Product selected for purchase is: " + actualItemName + " and listed item is: " + expectedItemName);
                            await driver.findElement(By.xpath("//button[@id='back-to-products']")).click();
                        }
                    }
                }
                await driver.findElement(By.xpath("//button[text()='Open Menu']")).click();
                await driver.sleep(1000);
                await driver.findElement(By.linkText('Logout')).click();
                console.log("Logged out successfully.");
            }
            //performance_glitch_user workflow
            else {
                console.log("User: performance_glitch_user");
                await driver.findElement(By.xpath('//input[@name="user-name"]')).sendKeys(user);
                await driver.findElement(By.xpath('//input[@name="password"]')).sendKeys(password);
                await driver.findElement(By.xpath("//input[@type='submit']")).click();
                var pageCheck = await driver.findElement(By.xpath("//span[text()='Products']"));
                if (pageCheck.length > 0) {
                    console.log("Successful Login!");
                    await driver.findElement(By.linkText('Sauce Labs Fleece Jacket')).click();
                    await driver.findElement(By.xpath("//button[text()='Add to cart']")).click();
                    await driver.findElement(By.xpath("//span[@class='shopping_cart_badge']")).click();
                    var productJacket = driver.findElement(By.xpath("//div[text()='Sauce Labs Backpack']")).getText();
                    const jacketElementCheck = await productJacket;
                    if (jacketElementCheck) {
                        console.log("Product added to the cart successfully.");
                    }
                    else {
                        console.log("Oops! Product not added to the cart.");
                    }
                    await driver.findElement(By.xpath("//button[text()='Checkout']")).click();
                    await driver.findElement(By.xpath("//input[@id='first-name']")).sendKeys("Anit");
                    await driver.findElement(By.xpath("//input[@id='last-name']")).sendKeys("Simon");
                    await driver.findElement(By.xpath("//input[@id='postal-code']")).sendKeys("T2A 2E2");
                    await driver.findElement(By.xpath("//input[@id='continue']")).click();
                    await driver.findElement(By.xpath("//button[@id='finish']")).click();
                    var successMessage = driver.findElement(By.xpath("//h2[text()='Thank you for your order!']")).getText();
                    console.log("Products checked out successfully.");
                    await driver.findElement(By.xpath("//button[text()='Back Home']")).click();
                    await driver.findElement(By.xpath("//button[text()='Open Menu']")).click();
                    await driver.findElement(By.linkText('Logout')).click();
                    console.log("Logged out successfully.");
                }
                else {
                    console.log("Page not loaded successfully");
                }
            }
        }
        await driver.quit();
    } catch (exception) {
        console.log(exception);
        await driver.quit();
    }
}
UserLogin();






