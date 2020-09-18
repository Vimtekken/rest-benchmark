#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate rocket;

#[cfg(test)] mod tests;

#[get("/")]
fn hello() -> &'static str {
    "Hello, world!"
}

#[get("/healthcheck")]
pub fn health() -> &'static str {
	""
}

fn main() {
    rocket::ignite().mount("/", routes![hello, health]).launch();
}
